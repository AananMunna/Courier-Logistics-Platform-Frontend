import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AuthTokens,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegistrationPayload,
  ResetPasswordPayload,
  Rider,
  RiderRegistrationPayload,
  User,
  VerifyAccountPayload,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function userRegistration(payload: RegistrationPayload) {
  return apiClient<ApiResponse<null>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient<ApiResponse<AuthTokens & { user: User }>>(
    "/auth/verify-email",
    { method: "POST", body: payload },
  );
}

export function riderRegistration(payload: RiderRegistrationPayload) {
  return apiClient<ApiResponse<null>>("/auth/register-rider", {
    method: "POST",
    body: payload,
  });
}

export function verifyRiderAccount(payload: VerifyAccountPayload) {
  return apiClient<ApiResponse<{ user: User; rider: Rider }>>(
    "/auth/verify-rider-email",
    { method: "POST", body: payload },
  );
}

export function userLogout() {
  return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient<ApiResponse<User>>("/auth/me");
}

export function googleOAuth(payload: { idToken: string }) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/google", {
    method: "POST",
    body: payload,
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export function changePassword(payload: ChangePasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/change-password", {
    method: "POST",
    body: payload,
  });
}
