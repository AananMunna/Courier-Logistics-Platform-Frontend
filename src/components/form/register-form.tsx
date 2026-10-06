"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useRegistration } from "@/hooks";
import { notify } from "@/lib/notify";
import { normalizePhone } from "@/utils";
import { customerRegistrationSchema } from "@/validation";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { PasswordField, TextField } from "../shared/form-fields";

export function RegisterForm() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegistration();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
    },
    validators: { onSubmit: customerRegistrationSchema },
    onSubmit: ({ value }) => {
      const email = value.email.trim().toLowerCase();
      const contactNumber = normalizePhone(value.contactNumber);

      register(
        {
          name: value.name.trim(),
          email,
          password: value.password,
          ...(contactNumber ? { customer: { contactNumber } } : {}),
        },
        {
          onSuccess: () => {
            notify.success(
              "Check your email",
              "We sent a 6-digit code to verify your account.",
            );
            router.push(
              `/register/verify-account?${new URLSearchParams({ email })}`,
            );
          },
          onError: (error) =>
            notify.error("Couldn't create your account", error, {
              409: "An account with this email already exists. Try logging in.",
            }),
        },
      );
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Start sending parcels in under a minute
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
          <form.Field name="name">
            {(field) => (
              <TextField
                field={field}
                label="Full name"
                autoComplete="name"
                placeholder="Your name"
              />
            )}
          </form.Field>
          <form.Field name="email">
            {(field) => (
              <TextField
                field={field}
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            )}
          </form.Field>
          <form.Field name="contactNumber">
            {(field) => (
              <TextField
                field={field}
                label="Mobile number"
                optional
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="01712345678"
                hint="Used for delivery updates and bKash."
              />
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <PasswordField
                field={field}
                label="Password"
                autoComplete="new-password"
                hint="8+ characters with upper & lower case, a number and a symbol."
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
          <Button
            type="submit"
            size="lg"
            className="h-11 text-base shadow-[0_10px_24px_-12px_var(--primary)]"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner /> Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </FieldGroup>
      </form>

      <FieldSeparator>or</FieldSeparator>
      <GoogleLoginComponent />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
