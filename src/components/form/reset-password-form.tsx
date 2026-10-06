"use client";

import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useResetPassword } from "@/hooks";
import { notify } from "@/lib/notify";
import { resetPasswordSchema } from "@/validation";
import { PasswordField } from "../shared/form-fields";

export default function ResetPasswordForm() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";
  const { mutate: reset, isPending } = useResetPassword();

  useEffect(() => {
    if (!email) {
      router.replace("/forgot-password");
    }
  }, [email, router]);

  const form = useForm({
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: ({ value }) => {
      reset(
        { email, otp: value.otp, newPassword: value.newPassword },
        {
          onSuccess: () => {
            notify.success(
              "Password updated",
              "You can now log in with your new password.",
            );
            router.replace("/login");
          },
          onError: (error) =>
            notify.error("Couldn't reset your password", error, {
              400: "That code is wrong or has expired. Request a new one.",
            }),
        },
      );
    },
  });

  if (!email) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">
          Set a new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the code sent to{" "}
          <span className="font-medium text-foreground">{email}</span>
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
          <form.Field name="otp">
            {(field) => {
              const invalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={invalid} className="items-center">
                  <FieldLabel htmlFor="otp">6-digit code</FieldLabel>
                  <InputOTP
                    id="otp"
                    maxLength={6}
                    value={field.state.value}
                    pattern={REGEXP_ONLY_DIGITS}
                    autoComplete="one-time-code"
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {invalid && (
                    <FieldError
                      errors={field.state.meta.errors as { message?: string }[]}
                    />
                  )}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="newPassword">
            {(field) => (
              <PasswordField
                field={field}
                label="New password"
                autoComplete="new-password"
              />
            )}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => (
              <PasswordField
                field={field}
                label="Confirm new password"
                autoComplete="new-password"
              />
            )}
          </form.Field>
          <Button
            type="submit"
            size="lg"
            className="h-11 text-base shadow-[0_10px_24px_-12px_var(--primary)]"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner /> Updating…
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </FieldGroup>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        No code?{" "}
        <Link
          href="/forgot-password"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Send a new one
        </Link>
      </p>
    </div>
  );
}
