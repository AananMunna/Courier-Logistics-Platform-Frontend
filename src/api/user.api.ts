import apiClient from "@/lib/apiClient";
import { uploadWithProgress } from "@/lib/upload";
import type {
  ApiResponse,
  UpdateMePayload,
  UpdateUserStatusPayload,
  User,
  UserParams,
} from "@/types";
import { cleanParams } from "@/utils/url.util";

export function updateMe(payload: UpdateMePayload) {
  return apiClient<ApiResponse<User>>("/users/me", {
    method: "PATCH",
    body: payload,
  });
}

export function uploadProfileImage(
  file: File,
  onProgress?: (percent: number) => void,
) {
  const formData = new FormData();
  formData.append("profileImage", file);

  return uploadWithProgress<User>("/users/profile-image", formData, onProgress);
}

export function getAllUsers(params: UserParams) {
  return apiClient<ApiResponse<User[]>>("/users", {
    params: cleanParams(params),
  });
}

export function updateUserStatus({ userId, status }: UpdateUserStatusPayload) {
  return apiClient<ApiResponse<User>>(`/users/${userId}/status`, {
    method: "PATCH",
    body: { status },
  });
}
