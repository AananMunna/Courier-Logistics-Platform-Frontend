"use client";

import { useForm } from "@tanstack/react-form";
import { SelectField, TextField } from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { VEHICLE_TYPES } from "@/constants";
import { useMyRiderProfile, useUpdateMyRiderProfile } from "@/hooks";
import { notify } from "@/lib/notify";
import type { Rider } from "@/types";
import { normalizePhone } from "@/utils";
import { riderSettingsSchema } from "@/validation";

function RiderSettingsFields({ rider }: { rider: Rider }) {
  const { mutate: save, isPending } = useUpdateMyRiderProfile();

  const form = useForm({
    defaultValues: {
      contactNumber: rider.contactNumber ?? "",
      address: rider.address ?? "",
      currentZone: rider.currentZone ?? "",
      vehicleType: rider.vehicleType,
    },
    validators: { onSubmit: riderSettingsSchema },
    onSubmit: ({ value }) => {
      save(
        {
          contactNumber: normalizePhone(value.contactNumber),
          address: value.address.trim(),
          currentZone: value.currentZone.trim(),
          vehicleType: value.vehicleType,
        },
        {
          onSuccess: () => notify.success("Rider details saved"),
          onError: (error) => notify.error("Couldn't save", error),
        },
      );
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
        <form.Field name="contactNumber">
          {(field) => (
            <TextField
              field={field}
              label="Mobile number"
              type="tel"
              inputMode="tel"
              placeholder="01712345678"
            />
          )}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="vehicleType">
            {(field) => (
              <SelectField field={field} label="Vehicle">
                {VEHICLE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </SelectField>
            )}
          </form.Field>
          <form.Field name="currentZone">
            {(field) => (
              <TextField
                field={field}
                label="Working zone"
                placeholder="e.g. Dhaka"
              />
            )}
          </form.Field>
        </div>
        <form.Field name="address">
          {(field) => <TextField field={field} label="Home address" optional />}
        </form.Field>
        <div className="grid gap-2 rounded-lg bg-muted/40 p-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Registration: </span>
            <span className="font-medium">
              {rider.vehicleRegistrationNumber}
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Deliveries: </span>
            <span className="font-medium">{rider.totalDeliveries}</span>
          </p>
        </div>
        <form.Subscribe selector={(state) => state.isDirty}>
          {(isDirty) => (
            <Button
              type="submit"
              className="w-fit"
              disabled={isPending || !isDirty}
            >
              {isPending && <Spinner />} Save changes
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}

export function RiderSettingsForm() {
  const { data, isPending } = useMyRiderProfile();

  if (isPending || !data) {
    return <Skeleton className="h-72 w-full rounded-2xl" />;
  }

  return <RiderSettingsFields rider={data.data} />;
}
