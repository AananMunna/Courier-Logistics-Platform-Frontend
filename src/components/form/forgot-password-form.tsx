"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword } from "@/hooks";
import { notify } from "@/lib/notify";
import { forgotPasswordSchema } from "@/validation";
import { TextField } from "../shared/form-fields";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { mutate: sendCode, isPending } = useForgotPassword();

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: ({ value }) => {
      const email = value.email.trim().toLowerCase();

      sendCode(
        { email },
        {
          onSuccess: () => {
            notify.success(
              "Code sent",
              "Check your email for the 6-digit reset code.",
            );
            router.push(`/reset-password?${new URLSearchParams({ email })}`);
          },
          onError: (error) =>
            notify.error("Couldn't send the code", error, {
              404: "No account found with this email.",
            }),
        },
      );
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a code to reset it.
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
          <Button
            type="submit"
            size="lg"
            className="h-11 text-base shadow-[0_10px_24px_-12px_var(--primary)]"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner /> Sending…
              </>
            ) : (
              "Send reset code"
            )}
          </Button>
        </FieldGroup>
      </form>
      <Link
        href="/login"
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to login
      </Link>
    </div>
  );
}
