import type { Metadata } from "next";
import { Suspense } from "react";
import ForgotPasswordForm from "@/components/form/forgot-password-form";
import AuthShell from "@/components/layout/auth-shell";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your password with an email code.",
  robots: { index: false },
};

export default function Page() {
  return (
    <AuthShell>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
