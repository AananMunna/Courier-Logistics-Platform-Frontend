"use client";

import { useForm } from "@tanstack/react-form";
import { PasswordField } from "@/components/shared/form-fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useChangePassword, useCurrentUser } from "@/hooks";
import { notify } from "@/lib/notify";
import { changePasswordSchema } from "@/validation";

export function ChangePasswordForm() {
  const { user } = useCurrentUser();
  const { mutate: change, isPending } = useChangePassword();

  const form = useForm({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validators: { onSubmit: changePasswordSchema },
    onSubmit: ({ value, formApi }) => {
      change(
        { oldPassword: value.oldPassword, newPassword: value.newPassword },
        {
          onSuccess: () => {
            notify.success("Password changed");
            formApi.reset();
          },
          onError: (error) =>
            notify.error("Couldn't change password", error, {
              400: "Your current password is incorrect.",
              401: "Your current password is incorrect.",
            }),
        },
      );
    },
  });

  if (user?.authProvider === "GOOGLE") {
    return (
      <Alert variant="info">
        <AlertDescription>
          You signed in with Google, so there&apos;s no password to change here.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="oldPassword">
          {(field) => <PasswordField field={field} label="Current password" />}
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
        <Button type="submit" className="w-fit" disabled={isPending}>
          {isPending && <Spinner />} Update password
        </Button>
      </FieldGroup>
    </form>
  );
}
