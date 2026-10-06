"use client";

import { useForm } from "@tanstack/react-form";
import { TextareaField, TextField } from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser, useUpdateMe } from "@/hooks";
import { notify } from "@/lib/notify";
import { normalizePhone } from "@/utils";
import { profileSchema } from "@/validation";

/** Name for everyone; mobile + address are stored on the customer profile. */
export function ProfileForm() {
  const { user } = useCurrentUser();
  const { mutate: save, isPending } = useUpdateMe();
  const isCustomer = user?.role === "CUSTOMER";

  const form = useForm({
    defaultValues: {
      name: user?.name ?? "",
      contactNumber: user?.customer?.contactNumber ?? "",
      address: user?.customer?.address ?? "",
    },
    validators: { onSubmit: profileSchema },
    onSubmit: ({ value }) => {
      // The API rejects empty strings for the phone number, so only send it when filled in.
      const contactNumber = normalizePhone(value.contactNumber);

      save(
        {
          name: value.name.trim(),
          ...(isCustomer
            ? {
                customer: {
                  ...(contactNumber ? { contactNumber } : {}),
                  address: value.address.trim(),
                },
              }
            : {}),
        },
        {
          onSuccess: () => notify.success("Profile saved"),
          onError: (error) => notify.error("Couldn't save profile", error),
        },
      );
    },
  });

  if (!user) {
    return null;
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
        <form.Field name="name">
          {(field) => (
            <TextField field={field} label="Full name" autoComplete="name" />
          )}
        </form.Field>
        <div className="space-y-1.5">
          <span className="text-sm font-medium">Email</span>
          <p className="rounded-lg border bg-muted/40 px-2.5 py-2.5 text-sm text-muted-foreground">
            {user.email}
          </p>
        </div>
        {isCustomer && (
          <>
            <form.Field name="contactNumber">
              {(field) => (
                <TextField
                  field={field}
                  label="Mobile number"
                  optional
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  hint="Pre-filled when you book a shipment."
                />
              )}
            </form.Field>
            <form.Field name="address">
              {(field) => (
                <TextareaField
                  field={field}
                  label="Default pickup address"
                  optional
                  rows={2}
                />
              )}
            </form.Field>
          </>
        )}
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
