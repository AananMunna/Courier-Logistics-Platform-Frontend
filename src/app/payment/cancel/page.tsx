import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentResult from "@/components/modules/payments/payment-result";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false },
};

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={<Skeleton className="mx-auto mt-24 h-64 w-full max-w-md" />}
    >
      <PaymentResult outcome="cancel" />
    </Suspense>
  );
}
