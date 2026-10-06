import { FetchError, type FetchOptions, ofetch } from "ofetch";

/**
 * Relative by default ("/api/v1"): Next.js rewrites it to the backend so the
 * auth cookies stay first-party. Set an absolute URL to call the backend directly.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly data: unknown;

  constructor(
    message: string,
    status: number,
    statusText = "",
    data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

interface ErrorBody {
  message?: string;
}

function toApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof FetchError) {
    const status = error.statusCode ?? error.response?.status ?? 0;

    if (!error.response) {
      return new ApiError(
        "Unable to reach the server. Check your connection and try again.",
        0,
      );
    }

    const body = error.data as ErrorBody | undefined;
    return new ApiError(
      body?.message ?? error.statusMessage ?? "Request failed",
      status,
      error.statusMessage ?? "",
      error.data,
    );
  }

  return new ApiError(
    error instanceof Error ? error.message : "Unexpected error",
    0,
  );
}

const rawClient = ofetch.create({
  baseURL: API_BASE_URL,
  credentials: "include",
  retry: 0,
});

const NO_REFRESH_PREFIXES = [
  "/auth/login",
  "/auth/logout",
  "/auth/refresh-token",
  "/auth/register",
  "/auth/verify",
  "/auth/google",
  "/auth/forgot-password",
  "/auth/reset-password",
];

let refreshPromise: Promise<boolean> | null = null;

/** Single-flight refresh so parallel 401s trigger only one token rotation. */
function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = rawClient("/auth/refresh-token", { method: "POST" })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function apiClient<T = unknown>(
  request: string,
  options?: FetchOptions<"json">,
): Promise<T> {
  try {
    return await rawClient<T>(request, options);
  } catch (error) {
    const apiError = toApiError(error);
    const canRefresh =
      apiError.status === 401 &&
      !NO_REFRESH_PREFIXES.some((prefix) => request.startsWith(prefix));

    if (canRefresh && (await refreshSession())) {
      try {
        return await rawClient<T>(request, options);
      } catch (retryError) {
        throw toApiError(retryError);
      }
    }

    throw apiError;
  }
}

export default apiClient;
