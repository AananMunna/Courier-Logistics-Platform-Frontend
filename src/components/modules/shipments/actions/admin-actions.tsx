"use client";

import { RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ReasonDialog } from "@/components/shared/reason-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteShipment, useRefundPayment } from "@/hooks";
import { notify } from "@/lib/notify";
import type { Shipment } from "@/types";
import { canAssignRider } from "@/utils";
import { AssignRiderDialog } from "./assign-rider-dialog";
import { StatusActions } from "./status-actions";

export function AdminActions({ shipment }: { shipment: Shipment }) {
  const router = useRouter();
  const [refundOpen, setRefundOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: refund, isPending: refunding } = useRefundPayment();
  const { mutate: remove, isPending: deleting } = useDeleteShipment();

  const canRefund =
    shipment.payment?.status === "PAID" &&
    shipment.payment.method === "BKASH" &&
    !!shipment.payment.bkashTrxId;

  return (
    <div className="space-y-2">
      {canAssignRider(shipment.status) && (
        <AssignRiderDialog shipment={shipment} />
      )}
      <StatusActions shipment={shipment} />

      {canRefund && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setRefundOpen(true)}
        >
          <RotateCcw /> Refund bKash payment
        </Button>
      )}
      <Button
        variant="ghost"
        className="w-full text-destructive hover:text-destructive"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 /> Delete shipment
      </Button>

      <ReasonDialog
        open={refundOpen}
        onOpenChange={setRefundOpen}
        title="Refund this payment?"
        description="The full delivery fee is returned to the customer's bKash account. This cannot be undone."
        label="Refund reason"
        placeholder="e.g. Shipment cancelled before pickup"
        confirmLabel="Refund payment"
        destructive
        isPending={refunding}
        onConfirm={(reason) =>
          refund(
            { shipmentId: shipment.id, refundReason: reason },
            {
              onSuccess: () => {
                notify.success("Payment refunded");
                setRefundOpen(false);
              },
              onError: (error) => notify.error("Refund failed", error),
            },
          )
        }
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this shipment?"
        description="It will be hidden from lists and reports. Tracking history is kept for audit."
        confirmLabel="Delete shipment"
        destructive
        isPending={deleting}
        onConfirm={() =>
          remove(shipment.id, {
            onSuccess: () => {
              notify.success("Shipment deleted");
              router.replace("/admin/shipments");
            },
            onError: (error) => notify.error("Couldn't delete shipment", error),
          })
        }
      />
    </div>
  );
}
