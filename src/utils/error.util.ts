import { ApiError } from "@/lib/apiClient";

const GENERIC_SERVER_MESSAGE = "Internal Server Error";

const STATUS_MESSAGES: Record<number, string> = {
  400: "Please check the information you entered and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "This was just changed by someone else. Please refresh and try again.",
  429: "Too many requests. Please wait a moment and try again.",
  502: "A payment or email service did not respond. Please try again shortly.",
};

/**
 * Turns anything thrown by the API layer into a message safe to show to users.
 * `overrides` lets a call site give status-specific copy (e.g. 401 on login).
 */
export function getErrorMessage(
  error: unknown,
  overrides: Partial<Record<number, string>> = {},
  fallback = "Something went wrong. Please try again.",
) {
  if (error instanceof ApiError) {
    const override = overrides[error.status];
    if (override) {
      return override;
    }
    const isGeneric =
      !error.message ||
      error.message === GENERIC_SERVER_MESSAGE ||
      error.message === error.statusText;

    if (!isGeneric) {
      return error.message;
    }
    if (error.status >= 500) {
      return fallback;
    }
    return STATUS_MESSAGES[error.status] ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
