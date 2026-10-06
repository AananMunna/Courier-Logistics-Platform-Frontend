"use client";

import { useState } from "react";
import { ReasonDialog } from "@/components/shared/reason-dialog";
import { Button } from "@/components/ui/button";
import { useCancelShipment } from "@/hooks";
import { notify } from "@/lib/notify";

export function CancelShipmentButton({ shipmentId }: { shipmentId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate: cancel, isPending } = useCancelShipment();

  return (
    <>
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        Cancel shipment
      </Button>
      <ReasonDialog
        open={open}
        onOpenChange={setOpen}
        title="Cancel this shipment?"
        description="You can only cancel before the rider picks up the parcel. This cannot be undone."
        label="Reason"
        required={false}
        placeholder="Why are you cancelling? (helps us improve)"
        confirmLabel="Yes, cancel shipment"
        destructive
        isPending={isPending}
        onConfirm={(reason) =>
          cancel(
            { shipmentId, ...(reason ? { cancelReason: reason } : {}) },
            {
              onSuccess: () => {
                notify.success("Shipment cancelled");
                setOpen(false);
              },
              onError: (error) => notify.error("Couldn't cancel", error),
            },
          )
        }
      />
    </>
  );
}
