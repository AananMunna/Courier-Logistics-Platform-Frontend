"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, CircleSlash, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { LinkButton } from "@/components/ui/link-button";
import { useCurrentUser } from "@/hooks";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

type Outcome = "success" | "failure" | "cancel";

const COPY = {
  success: {
    icon: CheckCircle2,
    tone: "bg-emerald-500/10 text-emerald-600",
    title: "Payment successful",
    text: "Thank you! Your bKash payment was received and your booking is confirmed.",
  },
  failure: {
    icon: XCircle,
    tone: "bg-red-500/10 text-red-600",
    title: "Payment failed",
    text: "We couldn't complete your payment. You haven't been charged — you can try again from your shipment page.",
  },
  cancel: {
    icon: CircleSlash,
    tone: "bg-amber-500/10 text-amber-600",
    title: "Payment cancelled",
    text: "You cancelled the payment. Your shipment is still booked — pay any time before delivery.",
  },
} as const;

export default function PaymentResult({ outcome }: { outcome: Outcome }) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  // Backend reports cancelled bKash attempts through the failure URL.
  const reason = searchParams.get("reason");
  const copy = COPY[outcome];
  const Icon = copy.icon;
  const paymentId = searchParams.get("paymentID");

  useEffect(() => {
    // Make sure the next screen shows fresh payment/shipment state.
    queryClient.invalidateQueries({ queryKey: queryKeys.payments });
    queryClient.invalidateQueries({ queryKey: queryKeys.shipments });
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
  }, [queryClient]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <span
        className={cn(
          "cg-pop rounded-3xl p-5 ring-8 ring-current/10",
          copy.tone,
        )}
      >
        <Icon className="size-10" aria-hidden="true" />
      </span>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.text}</p>
        {reason === "missing_params" && (
          <p className="text-sm text-muted-foreground">
            The payment link was incomplete. Please start again.
          </p>
        )}
        {paymentId && (
          <p className="font-mono text-xs text-muted-foreground">
            Ref: {paymentId}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        {user ? (
          <>
            <LinkButton href="/dashboard/shipments" size="lg" className="h-10">
              View my shipments
            </LinkButton>
            <LinkButton
              href="/dashboard/payments"
              variant="outline"
              size="lg"
              className="h-10"
            >
              Payment history
            </LinkButton>
          </>
        ) : (
          <>
            <LinkButton
              href="/login?redirect=/dashboard/shipments"
              size="lg"
              className="h-10"
            >
              Log in to continue
            </LinkButton>
            <LinkButton href="/" variant="outline" size="lg" className="h-10">
              Home
            </LinkButton>
          </>
        )}
      </div>
    </div>
  );
}
