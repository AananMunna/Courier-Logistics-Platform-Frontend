"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import type { DemoAccount } from "@/config/demo-accounts";
import { ROLE_HOME } from "@/constants";
import { useLogin, useRefreshSession } from "@/hooks";
import { notify } from "@/lib/notify";
import { getSafeRedirect } from "@/utils";
import { loginSchema } from "@/validation";
import { DemoLogin } from "../modules/auth/demo-login";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { PasswordField, TextField } from "../shared/form-fields";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("redirect"));

  const { mutateAsync: login, isPending } = useLogin();
  const refreshSession = useRefreshSession();
  const [demoRole, setDemoRole] = useState<DemoAccount["role"] | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      await login({ email, password });
      const user = await refreshSession();
      notify.success("Welcome back", user.name);
      router.replace(redirectTo ?? ROLE_HOME[user.role]);
    } catch (error) {
      notify.error("Couldn't log you in", error, {
        401: "Incorrect email or password.",
        404: "No account found with this email.",
      });
    } finally {
      setDemoRole(null);
    }
  };

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: ({ value }) => signIn(value.email.trim(), value.password),
  });

  const busy = isPending || demoRole !== null;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Log in to book and track your parcels
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
                placeholder="you@example.com"
              />
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => <PasswordField field={field} label="Password" />}
          </form.Field>
          <div className="-mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-11 text-base shadow-[0_10px_24px_-12px_var(--primary)]"
            disabled={busy}
          >
            {isPending && demoRole === null ? (
              <>
                <Spinner /> Logging in…
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </FieldGroup>
      </form>

      <FieldSeparator>or</FieldSeparator>

      <DemoLogin
        pendingRole={demoRole}
        disabled={busy}
        onSelect={(account) => {
          setDemoRole(account.role);
          void signIn(account.email, account.password);
        }}
      />

      <GoogleLoginComponent />

      <div className="space-y-1 text-center text-sm text-muted-foreground">
        <p>
          New here?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Create an account
          </Link>
        </p>
        <p>
          Want to deliver with us?{" "}
          <Link
            href="/apply"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Become a rider
          </Link>
        </p>
      </div>
    </div>
  );
}
