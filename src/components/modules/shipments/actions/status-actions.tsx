"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ReasonDialog } from "@/components/shared/reason-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { NEXT_STATUS_ACTIONS } from "@/constants";
import { useUpdateShipmentStatus } from "@/hooks";
import { notify } from "@/lib/notify";
import type { Shipment, UpdateShipmentStatusPayload } from "@/types";
import { formatCurrency } from "@/utils";

type NextStatus = UpdateShipmentStatusPayload["status"];

const SUCCESS_COPY: Record<NextStatus, string> = {
  PICKED_UP: "Parcel marked as picked up",
  IN_TRANSIT: "Parcel is now in transit",
  OUT_FOR_DELIVERY: "Parcel is out for delivery",
  DELIVERED: "Delivered — great job!",
  FAILED: "Delivery problem reported",
  RETURNED: "Parcel marked as returned",
};

/** One-tap status updates that follow the backend's strict transition map. */
export function StatusActions({ shipment }: { shipment: Shipment }) {
  const actions = NEXT_STATUS_ACTIONS[shipment.status] ?? [];
  const { mutate: update, isPending } = useUpdateShipmentStatus();
  const [confirming, setConfirming] = useState<NextStatus | null>(null);

  if (actions.length === 0) {
    return null;
  }

  const run = (status: NextStatus, extra: { failureReason?: string } = {}) => {
    update(
      { shipmentId: shipment.id, status, ...extra },
      {
        onSuccess: () => {
          notify.success(SUCCESS_COPY[status]);
          setConfirming(null);
        },
        onError: (error) => notify.error("Couldn't update status", error),
      },
    );
  };

  const needsConfirm = (status: NextStatus) =>
    status === "DELIVERED" || status === "RETURNED";

  return (
    <>
      <div className="flex flex-col gap-2">
        {actions.map((action) => (
          <Button
            key={action.status}
            size="lg"
            variant={action.variant}
            className="h-11 w-full text-base"
            disabled={isPending}
            onClick={() => {
              if (action.status === "FAILED" || needsConfirm(action.status)) {
                setConfirming(action.status);
              } else {
                run(action.status);
              }
            }}
          >
            {isPending &&
              confirming === null &&
              action.variant === "default" && <Spinner />}
            {action.label}
          </Button>
        ))}
      </div>

      <ReasonDialog
        open={confirming === "FAILED"}
        onOpenChange={(open) => !open && setConfirming(null)}
        title="What went wrong?"
        description="The customer and admin will see this reason. The parcel can then be re-assigned or returned."
        label="Reason"
        placeholder="e.g. Receiver unreachable, wrong address, refused to accept"
        confirmLabel="Report failed delivery"
        destructive
        isPending={isPending}
        onConfirm={(reason) => run("FAILED", { failureReason: reason })}
      />

      <ConfirmDialog
        open={confirming === "DELIVERED"}
        onOpenChange={(open) => !open && setConfirming(null)}
        title="Confirm delivery"
        description={
          shipment.isCod && Number(shipment.codAmount) > 0
            ? `Make sure you have collected ${formatCurrency(shipment.codAmount)} in cash from the receiver.`
            : "Confirm that the parcel has been handed to the receiver."
        }
        confirmLabel="Yes, delivered"
        isPending={isPending}
        onConfirm={() => run("DELIVERED")}
      />

      <ConfirmDialog
        open={confirming === "RETURNED"}
        onOpenChange={(open) => !open && setConfirming(null)}
        title="Mark as returned?"
        description="Use this when the parcel is on its way back to the sender."
        confirmLabel="Mark returned"
        isPending={isPending}
        onConfirm={() => run("RETURNED")}
      />
    </>
  );
}
