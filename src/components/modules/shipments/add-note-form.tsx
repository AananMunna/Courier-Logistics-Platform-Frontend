"use client";

import { useForm } from "@tanstack/react-form";
import { Send } from "lucide-react";
import { TextareaField } from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAddTrackingNote } from "@/hooks";
import { notify } from "@/lib/notify";
import { noteSchema } from "@/validation";

export function AddNoteForm({ shipmentId }: { shipmentId: string }) {
  const { mutate: addNote, isPending } = useAddTrackingNote();

  const form = useForm({
    defaultValues: { note: "" },
    validators: { onSubmit: noteSchema },
    onSubmit: ({ value, formApi }) => {
      addNote(
        { shipmentId, note: value.note.trim() },
        {
          onSuccess: () => {
            notify.success("Note added to the timeline");
            formApi.reset();
          },
          onError: (error) => notify.error("Couldn't add note", error),
        },
      );
    },
  });

  return (
    <form
      noValidate
      className="space-y-3 rounded-2xl bg-muted/40 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="note">
        {(field) => (
          <TextareaField
            field={field}
            label="Add a note"
            rows={2}
            placeholder="e.g. Receiver asked to deliver after 5 PM"
          />
        )}
      </form.Field>
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        {isPending ? <Spinner /> : <Send />} Post note
      </Button>
    </form>
  );
}
