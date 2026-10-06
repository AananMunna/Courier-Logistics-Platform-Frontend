"use client";

import { useForm } from "@tanstack/react-form";
import { TextField } from "@/components/shared/form-fields";
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
import { useCreateHub, useUpdateHub } from "@/hooks";
import { notify } from "@/lib/notify";
import type { Hub } from "@/types";
import { normalizePhone } from "@/utils";
import { hubSchema } from "@/validation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hub?: Hub | null;
}

function HubFormFields({
  hub,
  onDone,
}: {
  hub?: Hub | null;
  onDone: () => void;
}) {
  const { mutate: create, isPending: creating } = useCreateHub();
  const { mutate: update, isPending: updating } = useUpdateHub();
  const isPending = creating || updating;

  const form = useForm({
    defaultValues: {
      name: hub?.name ?? "",
      zone: hub?.zone ?? "",
      address: hub?.address ?? "",
      contactNumber: hub?.contactNumber ?? "",
    },
    validators: { onSubmit: hubSchema },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name.trim(),
        zone: value.zone.trim(),
        address: value.address.trim(),
        ...(value.contactNumber.trim()
          ? { contactNumber: normalizePhone(value.contactNumber) }
          : {}),
      };
      const callbacks = {
        onSuccess: () => {
          notify.success(hub ? "Hub updated" : "Hub created");
          onDone();
        },
        onError: (error: unknown) =>
          notify.error(
            hub ? "Couldn't update hub" : "Couldn't create hub",
            error,
          ),
      };

      if (hub) {
        update({ hubId: hub.id, ...payload }, callbacks);
      } else {
        create(payload, callbacks);
      }
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => (
            <TextField
              field={field}
              label="Hub name"
              placeholder="e.g. Dhaka Central Hub"
            />
          )}
        </form.Field>
        <form.Field name="zone">
          {(field) => (
            <TextField field={field} label="Zone" placeholder="e.g. Dhaka" />
          )}
        </form.Field>
        <form.Field name="address">
          {(field) => <TextField field={field} label="Address" />}
        </form.Field>
        <form.Field name="contactNumber">
          {(field) => (
            <TextField
              field={field}
              label="Contact number"
              optional
              type="tel"
              inputMode="tel"
            />
          )}
        </form.Field>
      </FieldGroup>
      <DialogFooter className="mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />} {hub ? "Save changes" : "Create hub"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function HubFormDialog({ open, onOpenChange, hub }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{hub ? "Edit hub" : "Add a hub"}</DialogTitle>
          <DialogDescription>
            Hubs are the pickup and delivery points customers choose when
            booking.
          </DialogDescription>
        </DialogHeader>
        {/* key remounts the form with fresh defaults each time it opens or the hub changes */}
        {open && (
          <HubFormFields
            key={hub?.id ?? "new"}
            hub={hub}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
