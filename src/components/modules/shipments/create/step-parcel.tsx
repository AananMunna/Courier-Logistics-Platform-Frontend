"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TextareaField, TextField } from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { PARCEL_TYPES } from "@/constants";
import { cn } from "@/lib/utils";
import { type ParcelStepValues, parcelStepSchema } from "@/validation";

interface Props {
  defaultValues: ParcelStepValues;
  onNext: (values: ParcelStepValues) => void;
  onBack: () => void;
}

export function StepParcel({ defaultValues, onNext, onBack }: Props) {
  const form = useForm({
    defaultValues,
    validators: { onSubmit: parcelStepSchema },
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
        <form.Field name="parcelType">
          {(field) => (
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">
                What are you sending?
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PARCEL_TYPES.map((type) => {
                  const selected = field.state.value === type.value;
                  return (
                    <label
                      key={type.value}
                      className={cn(
                        "flex cursor-pointer flex-col rounded-2xl border p-3 text-sm transition-all hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                        selected
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50",
                      )}
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={type.value}
                        checked={selected}
                        onChange={() => field.handleChange(type.value)}
                        className="sr-only"
                      />
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {type.hint}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="weightKg">
            {(field) => (
              <TextField
                field={field}
                label="Weight (kg)"
                type="number"
                inputMode="decimal"
                min="0.1"
                step="0.1"
                placeholder="e.g. 1.5"
              />
            )}
          </form.Field>
          <form.Field name="distanceKm">
            {(field) => (
              <TextField
                field={field}
                label="Approx. distance (km)"
                optional
                type="number"
                inputMode="decimal"
                min="1"
                step="1"
                hint="Helps us calculate an exact fee."
              />
            )}
          </form.Field>
        </div>

        <form.Field name="parcelDescription">
          {(field) => (
            <TextareaField
              field={field}
              label="What's inside?"
              optional
              rows={2}
              placeholder="e.g. Two shirts and a book"
            />
          )}
        </form.Field>

        <div className="space-y-3 rounded-2xl border p-4">
          <form.Field name="isCod">
            {(field) => (
              <Field
                orientation="horizontal"
                className="items-center justify-between"
              >
                <div className="space-y-0.5">
                  <FieldLabel htmlFor="cod-switch">
                    Collect cash on delivery
                  </FieldLabel>
                  <FieldDescription>
                    The rider collects this amount from the receiver.
                  </FieldDescription>
                </div>
                <Switch
                  id="cod-switch"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </Field>
            )}
          </form.Field>
          <form.Subscribe selector={(state) => state.values.isCod}>
            {(isCod) =>
              isCod && (
                <form.Field name="codAmount">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Amount to collect (৳)"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      step="1"
                      placeholder="e.g. 1200"
                    />
                  )}
                </form.Field>
              )
            }
          </form.Subscribe>
        </div>

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
            Review <ArrowRight />
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
