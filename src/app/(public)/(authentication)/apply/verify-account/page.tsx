import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyAccountForm from "@/components/form/verify-account-form";
import AuthShell from "@/components/layout/auth-shell";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Verify rider email",
  description: "Verify your email to submit your rider application.",
  robots: { index: false },
};

export default function Page() {
  return (
    <AuthShell>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <VerifyAccountForm mode="rider" />
      </Suspense>
    </AuthShell>
  );
}
