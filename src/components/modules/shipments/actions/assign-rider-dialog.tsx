"use client";

import { useForm } from "@tanstack/react-form";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { SelectField, TextareaField } from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { VEHICLE_TYPE_LABEL } from "@/constants";
import { useAssignRider, useGetAllRiders } from "@/hooks";
import { notify } from "@/lib/notify";
import type { Shipment } from "@/types";
import { assignRiderSchema } from "@/validation";

export function AssignRiderDialog({ shipment }: { shipment: Shipment }) {
  const [open, setOpen] = useState(false);
  const { mutate: assign, isPending } = useAssignRider();

  // Only fetch once the dialog is opened.
  const { data, isPending: ridersLoading } = useGetAllRiders(
    {
      verificationStatus: "APPROVED",
      isAvailable: true,
      limit: 100,
      sortBy: "name",
      sortOrder: "asc",
    },
    open,
  );
  const riders = data?.data ?? [];

  const form = useForm({
    defaultValues: { riderId: "", note: "" },
    validators: { onSubmit: assignRiderSchema },
    onSubmit: ({ value }) => {
      assign(
        {
          shipmentId: shipment.id,
          riderId: value.riderId,
          ...(value.note.trim() ? { note: value.note.trim() } : {}),
        },
        {
          onSuccess: () => {
            notify.success(
              "Rider assigned",
              "The rider can now see this shipment.",
            );
            setOpen(false);
            form.reset();
          },
          onError: (error) => notify.error("Couldn't assign rider", error),
        },
      );
    },
  });

  return (
    <>
      <Button
        size="lg"
        className="h-11 w-full text-base"
        onClick={() => setOpen(true)}
      >
        <UserPlus />{" "}
        {shipment.status === "FAILED" ? "Re-assign rider" : "Assign rider"}
      </Button>
      <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign a rider</DialogTitle>
            <DialogDescription>
              Only approved riders who are currently available are listed.
            </DialogDescription>
          </DialogHeader>
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="riderId">
                {(field) => (
                  <SelectField
                    field={field}
                    label="Rider"
                    disabled={ridersLoading}
                  >
                    <option value="">
                      {ridersLoading ? "Loading riders…" : "Choose a rider"}
                    </option>
                    {riders.map((rider) => (
                      <option key={rider.id} value={rider.id}>
                        {rider.name} · {VEHICLE_TYPE_LABEL[rider.vehicleType]}
                        {rider.currentZone ? ` · ${rider.currentZone}` : ""}
                      </option>
                    ))}
                  </SelectField>
                )}
              </form.Field>
              {!ridersLoading && riders.length === 0 && (
                <p className="-mt-2 text-sm text-muted-foreground">
                  No riders are available right now. Approve a rider application
                  or try again later.
                </p>
              )}
              <form.Field name="note">
                {(field) => (
                  <TextareaField
                    field={field}
                    label="Note for the rider"
                    optional
                    rows={2}
                  />
                )}
              </form.Field>
            </FieldGroup>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Go back
              </Button>
              <Button type="submit" disabled={isPending || riders.length === 0}>
                {isPending && <Spinner />} Assign
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
