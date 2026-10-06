"use client";

import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useInitiatePayment } from "@/hooks";
import { notify } from "@/lib/notify";
import type { Shipment } from "@/types";
import { formatCurrency } from "@/utils";

/** bKash tokenized checkout: create session on the backend, then redirect to bKash. */
export function PayButton({
  shipment,
}: {
  shipment: Pick<Shipment, "id" | "deliveryFee">;
}) {
  const { mutate: pay, isPending, isSuccess } = useInitiatePayment();
  const busy = isPending || isSuccess;

  const handlePay = () => {
    pay(shipment.id, {
      onSuccess: (response) => {
        const url = response.data?.bkashURL;
        if (!url) {
          notify.error(
            "Payment unavailable",
            new Error("bKash did not return a payment page."),
          );
          return;
        }
        window.location.assign(url);
      },
      onError: (error) => notify.error("Couldn't start payment", error),
    });
  };

  return (
    <Button
      size="lg"
      className="h-11 w-full text-base shadow-[0_10px_24px_-12px_var(--primary)]"
      onClick={handlePay}
      disabled={busy}
    >
      {busy ? <Spinner /> : <Smartphone />}
      {busy
        ? "Opening bKash…"
        : `Pay ${formatCurrency(shipment.deliveryFee)} with bKash`}
    </Button>
  );
}
