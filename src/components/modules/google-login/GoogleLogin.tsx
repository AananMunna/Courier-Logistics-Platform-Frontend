"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import { ROLE_HOME } from "@/constants";
import { useGoogleOAuth, useRefreshSession } from "@/hooks";
import { notify } from "@/lib/notify";
import { getSafeRedirect } from "@/utils";

/** Renders nothing unless NEXT_PUBLIC_GOOGLE_CLIENT_ID is configured. */
export default function GoogleLoginComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: googleLogin } = useGoogleOAuth();
  const refreshSession = useRefreshSession();

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      notify.error(
        "Google sign-in failed",
        new Error("No credential received."),
      );
      return;
    }

    try {
      await googleLogin({ idToken });
      const user = await refreshSession();
      notify.success("Welcome", user.name);
      router.replace(
        getSafeRedirect(searchParams.get("redirect")) ?? ROLE_HOME[user.role],
      );
    } catch (error) {
      notify.error("Google sign-in failed", error);
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        theme="outline"
        shape="pill"
        text="continue_with"
        onSuccess={handleSuccess}
        onError={() =>
          notify.error("Google sign-in failed", new Error("Please try again."))
        }
      />
    </div>
  );
}
