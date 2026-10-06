import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/form/login-form";
import AuthShell from "@/components/layout/auth-shell";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to book, pay and track your parcels.",
  robots: { index: false },
};

export default function Page() {
  return (
    <AuthShell>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
