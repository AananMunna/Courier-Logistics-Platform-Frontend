"use client";

import { useForm } from "@tanstack/react-form";
import { Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { VEHICLE_TYPES } from "@/constants";
import { useRiderRegistration } from "@/hooks";
import { notify } from "@/lib/notify";
import type { VehicleType } from "@/types";
import { normalizePhone } from "@/utils";
import { riderApplicationSchema } from "@/validation";
import { PasswordField, SelectField, TextField } from "../shared/form-fields";

export default function RiderApplyForm() {
  const router = useRouter();
  const { mutate: apply, isPending } = useRiderRegistration();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
      vehicleType: "MOTORCYCLE" as VehicleType,
      vehicleRegistrationNumber: "",
      nidNumber: "",
      drivingLicenseNumber: "",
      currentZone: "",
    },
    validators: { onSubmit: riderApplicationSchema },
    onSubmit: ({ value }) => {
      const email = value.email.trim().toLowerCase();
      const license = value.drivingLicenseNumber.trim();
      const zone = value.currentZone.trim();

      apply(
        {
          name: value.name.trim(),
          email,
          password: value.password,
          rider: {
            vehicleType: value.vehicleType,
            vehicleRegistrationNumber: value.vehicleRegistrationNumber.trim(),
            nidNumber: value.nidNumber.trim(),
            contactNumber: normalizePhone(value.contactNumber),
            ...(license ? { drivingLicenseNumber: license } : {}),
            ...(zone ? { currentZone: zone } : {}),
          },
        },
        {
          onSuccess: () => {
            notify.success(
              "Check your email",
              "Enter the 6-digit code to submit your application.",
            );
            router.push(
              `/apply/verify-account?${new URLSearchParams({ email })}`,
            );
          },
          onError: (error) =>
            notify.error("Couldn't submit your application", error, {
              409: "This email, NID or vehicle number is already registered.",
            }),
        },
      );
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Become a rider</h1>
        <p className="text-sm text-muted-foreground">
          Apply in 2 minutes. Our team reviews every application.
        </p>
      </div>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <fieldset className="space-y-4">
            <legend className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              About you
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="name">
                {(field) => (
                  <TextField
                    field={field}
                    label="Full name"
                    autoComplete="name"
                  />
                )}
              </form.Field>
              <form.Field name="contactNumber">
                {(field) => (
                  <TextField
                    field={field}
                    label="Mobile number"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01712345678"
                  />
                )}
              </form.Field>
            </div>
            <form.Field name="email">
              {(field) => (
                <TextField
                  field={field}
                  label="Email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                />
              )}
            </form.Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="password">
                {(field) => (
                  <PasswordField
                    field={field}
                    label="Password"
                    autoComplete="new-password"
                  />
                )}
              </form.Field>
              <form.Field name="confirmPassword">
                {(field) => (
                  <PasswordField
                    field={field}
                    label="Confirm password"
                    autoComplete="new-password"
                  />
                )}
              </form.Field>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Vehicle & ID
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="vehicleType">
                {(field) => (
                  <SelectField field={field} label="Vehicle type">
                    {VEHICLE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </SelectField>
                )}
              </form.Field>
              <form.Field name="vehicleRegistrationNumber">
                {(field) => (
                  <TextField
                    field={field}
                    label="Registration number"
                    placeholder="DHAKA-METRO-LA-11-1234"
                  />
                )}
              </form.Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="nidNumber">
                {(field) => (
                  <TextField
                    field={field}
                    label="NID number"
                    inputMode="numeric"
                    hint="10, 13 or 17 digits"
                  />
                )}
              </form.Field>
              <form.Field name="drivingLicenseNumber">
                {(field) => (
                  <TextField field={field} label="Driving license" optional />
                )}
              </form.Field>
            </div>
            <form.Field name="currentZone">
              {(field) => (
                <TextField
                  field={field}
                  label="Working zone"
                  optional
                  placeholder="e.g. Dhaka"
                />
              )}
            </form.Field>
          </fieldset>

          <Alert variant="info">
            <Info />
            <AlertDescription>
              After verifying your email, an admin reviews your application.
              You&apos;ll get an email once it&apos;s approved.
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            size="lg"
            className="h-11 text-base shadow-[0_10px_24px_-12px_var(--primary)]"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner /> Submitting…
              </>
            ) : (
              "Submit application"
            )}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already approved?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
