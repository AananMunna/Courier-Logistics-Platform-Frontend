import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  forgotPassword,
  getMe,
  googleOAuth,
  resetPassword,
  riderRegistration,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
  verifyRiderAccount,
} from "@/api";
import { queryKeys } from "@/lib/query-keys";

export function useGetMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

/** Convenience wrapper: the signed-in user (or undefined) plus loading flags. */
export function useCurrentUser() {
  const { data, isPending, isError } = useGetMe();
  // After a failed re-check the cache can still hold the previous user: treat that as signed out.
  const user = isError ? undefined : data?.data;

  return { user, isPending, isAuthenticated: !!user };
}

/** Refreshes the cached session after login/verification so guards see it immediately. */
export function useRefreshSession() {
  const queryClient = useQueryClient();

  return async () => {
    queryClient.removeQueries({ queryKey: queryKeys.me });
    const response = await queryClient.fetchQuery({
      queryKey: queryKeys.me,
      queryFn: getMe,
      staleTime: 0,
    });
    return response.data;
  };
}

export function useLogin() {
  return useMutation({ mutationFn: userLogin });
}

export function useRegistration() {
  return useMutation({ mutationFn: userRegistration });
}

export function useVerifyAccount() {
  return useMutation({ mutationFn: verifyAccount });
}

export function useRiderRegistration() {
  return useMutation({ mutationFn: riderRegistration });
}

export function useVerifyRiderAccount() {
  return useMutation({ mutationFn: verifyRiderAccount });
}

export function useGoogleOAuth() {
  return useMutation({ mutationFn: googleOAuth });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogout,
    onSettled: () => {
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword });
}
