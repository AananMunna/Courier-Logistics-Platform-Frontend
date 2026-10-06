import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/form/reset-password-form";
import AuthShell from "@/components/layout/auth-shell";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password.",
  robots: { index: false },
};

export default function Page() {
  return (
    <AuthShell>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
