import type { Metadata } from "next";
import { Suspense } from "react";
import RiderApplyForm from "@/components/form/rider-apply-form";
import AuthShell from "@/components/layout/auth-shell";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Become a rider",
  description: "Apply to deliver parcels with us.",
  robots: { index: false },
};

export default function Page() {
  return (
    <AuthShell wide>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <RiderApplyForm />
      </Suspense>
    </AuthShell>
  );
}
