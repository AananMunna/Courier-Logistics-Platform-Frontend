import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/form/register-form";
import AuthShell from "@/components/layout/auth-shell";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free account to start sending parcels.",
  robots: { index: false },
};

export default function Page() {
  return (
    <AuthShell>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
