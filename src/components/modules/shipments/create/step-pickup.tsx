"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRight } from "lucide-react";
import {
  SelectField,
  TextareaField,
  TextField,
} from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useActiveHubs } from "@/hooks";
import { type PickupStepValues, pickupStepSchema } from "@/validation";

interface Props {
  defaultValues: PickupStepValues;
  onNext: (values: PickupStepValues) => void;
}

export function StepPickup({ defaultValues, onNext }: Props) {
  const { data, isPending } = useActiveHubs();
  const hubs = data?.data ?? [];

  const form = useForm({
    defaultValues,
    validators: { onSubmit: pickupStepSchema },
    onSubmit: ({ value }) => onNext(value),
  });

  const hubOptions = (placeholder: string) => (
    <>
      <option value="">{isPending ? "Loading hubs…" : placeholder}</option>
      {hubs.map((hub) => (
        <option key={hub.id} value={hub.id}>
          {hub.name} — {hub.zone}
        </option>
      ))}
    </>
  );

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="originHubId">
            {(field) => (
              <SelectField
                field={field}
                label="Pickup hub"
                disabled={isPending}
                hint="Nearest hub to the pickup address"
              >
                {hubOptions("Choose pickup hub")}
              </SelectField>
            )}
          </form.Field>
          <form.Field name="destinationHubId">
            {(field) => (
              <SelectField
                field={field}
                label="Delivery hub"
                disabled={isPending}
                hint="Nearest hub to the receiver"
              >
                {hubOptions("Choose delivery hub")}
              </SelectField>
            )}
          </form.Field>
        </div>
        <form.Field name="pickupAddress">
          {(field) => (
            <TextareaField
              field={field}
              label="Pickup address"
              rows={2}
              placeholder="House, road, area, city"
            />
          )}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="pickupContactName">
            {(field) => (
              <TextField
                field={field}
                label="Contact name"
                autoComplete="name"
              />
            )}
          </form.Field>
          <form.Field name="pickupContactPhone">
            {(field) => (
              <TextField
                field={field}
                label="Contact phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="01712345678"
              />
            )}
          </form.Field>
        </div>
        <form.Field name="scheduledPickupAt">
          {(field) => (
            <TextField
              field={field}
              label="Preferred pickup time"
              optional
              type="datetime-local"
              hint="Leave empty for the earliest available pickup."
            />
          )}
        </form.Field>
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="h-11 px-5 text-base shadow-[0_10px_24px_-12px_var(--primary)]"
          >
            Next: Receiver <ArrowRight />
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
