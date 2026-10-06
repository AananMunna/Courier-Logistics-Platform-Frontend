"use client";

import { useForm } from "@tanstack/react-form";
import { Send } from "lucide-react";
import z from "zod";
import { TextareaField, TextField } from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { siteConfig } from "@/config/site";
import { notify } from "@/lib/notify";
import { emailSchema, nameSchema } from "@/validation";

const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .trim()
    .min(3, "Add a short subject")
    .max(120, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (10+ characters)")
    .max(1000, "Please keep it under 1000 characters"),
});

/** Opens the visitor's mail app with the message pre-filled (the backend has no contact endpoint). */
export default function ContactForm() {
  const form = useForm({
    defaultValues: { name: "", email: "", subject: "", message: "" },
    validators: { onSubmit: contactSchema },
    onSubmit: ({ value, formApi }) => {
      const body = `${value.message}\n\n— ${value.name} (${value.email})`;
      const href = `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(value.subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      notify.info(
        "Opening your email app",
        "Send the message from there and we'll reply soon.",
      );
      formApi.reset();
    },
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
          <form.Field name="name">
            {(field) => (
              <TextField field={field} label="Your name" autoComplete="name" />
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
              />
            )}
          </form.Field>
        </div>
        <form.Field name="subject">
          {(field) => <TextField field={field} label="Subject" />}
        </form.Field>
        <form.Field name="message">
          {(field) => (
            <TextareaField
              field={field}
              label="Message"
              rows={5}
              placeholder="Include your tracking code if it's about a parcel."
            />
          )}
        </form.Field>
        <Button
          type="submit"
          size="lg"
          className="h-11 text-base shadow-[0_10px_24px_-12px_var(--primary)]"
        >
          <Send /> Send message
        </Button>
      </FieldGroup>
    </form>
  );
}
