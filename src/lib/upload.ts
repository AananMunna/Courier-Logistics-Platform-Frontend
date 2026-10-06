import apiClient, { API_BASE_URL, ApiError } from "@/lib/apiClient";
import type { ApiResponse } from "@/types";

function sendOnce<T>(
  path: string,
  method: "PATCH" | "POST",
  formData: FormData,
  onProgress?: (percent: number) => void,
) {
  return new Promise<ApiResponse<T>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${API_BASE_URL}${path}`);
    xhr.withCredentials = true;
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      const body = xhr.response as
        | (ApiResponse<T> & { message?: string })
        | null;

      if (xhr.status >= 200 && xhr.status < 300 && body) {
        resolve(body);
        return;
      }
      reject(
        new ApiError(
          body?.message ?? "Upload failed",
          xhr.status,
          xhr.statusText,
          body,
        ),
      );
    };

    xhr.onerror = () =>
      reject(new ApiError("Unable to reach the server. Please try again.", 0));

    xhr.send(formData);
  });
}

/** multipart upload with progress; retries once after silently refreshing an expired session. */
export async function uploadWithProgress<T>(
  path: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
  method: "PATCH" | "POST" = "PATCH",
) {
  try {
    return await sendOnce<T>(path, method, formData, onProgress);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // apiClient refreshes the session transparently on 401.
      await apiClient("/auth/me");
      return sendOnce<T>(path, method, formData, onProgress);
    }
    throw error;
  }
}
