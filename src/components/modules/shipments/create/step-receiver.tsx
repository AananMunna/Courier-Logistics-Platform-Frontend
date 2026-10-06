"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TextareaField, TextField } from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { type ReceiverStepValues, receiverStepSchema } from "@/validation";

interface Props {
  defaultValues: ReceiverStepValues;
  onNext: (values: ReceiverStepValues) => void;
  onBack: () => void;
}

export function StepReceiver({ defaultValues, onNext, onBack }: Props) {
  const form = useForm({
    defaultValues,
    validators: { onSubmit: receiverStepSchema },
    onSubmit: ({ value }) => onNext(value),
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
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="deliveryContactName">
            {(field) => <TextField field={field} label="Receiver name" />}
          </form.Field>
          <form.Field name="deliveryContactPhone">
            {(field) => (
              <TextField
                field={field}
                label="Receiver phone"
                type="tel"
                inputMode="tel"
                placeholder="01712345678"
              />
            )}
          </form.Field>
        </div>
        <form.Field name="deliveryAddress">
          {(field) => (
            <TextareaField
              field={field}
              label="Delivery address"
              rows={3}
              placeholder="House, road, area, city"
            />
          )}
        </form.Field>
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 px-4 text-base"
            onClick={onBack}
          >
            <ArrowLeft /> Back
          </Button>
          <Button
            type="submit"
            size="lg"
            className="h-11 px-5 text-base shadow-[0_10px_24px_-12px_var(--primary)]"
          >
            Next: Parcel <ArrowRight />
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
