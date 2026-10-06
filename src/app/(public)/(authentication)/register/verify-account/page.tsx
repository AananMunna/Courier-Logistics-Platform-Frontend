import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyAccountForm from "@/components/form/verify-account-form";
import AuthShell from "@/components/layout/auth-shell";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Verify email",
  description: "Verify your email address.",
  robots: { index: false },
};

export default function Page() {
  return (
    <AuthShell>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <VerifyAccountForm mode="customer" />
      </Suspense>
    </AuthShell>
  );
}
