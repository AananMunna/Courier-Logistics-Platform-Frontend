"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, type ReactNode, useState } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

function useFieldState(field: AnyFieldApi) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return {
    isInvalid,
    errors: field.state.meta.errors as { message?: string }[],
  };
}

interface BaseProps {
  field: AnyFieldApi;
  label: string;
  hint?: string;
  optional?: boolean;
}

function Label({
  label,
  optional,
  htmlFor,
}: {
  label: string;
  optional?: boolean;
  htmlFor: string;
}) {
  return (
    <FieldLabel htmlFor={htmlFor}>
      {label}
      {optional && (
        <span className="font-normal text-muted-foreground">(optional)</span>
      )}
    </FieldLabel>
  );
}

export function TextField({
  field,
  label,
  hint,
  optional,
  ...inputProps
}: BaseProps &
  Omit<
    ComponentProps<typeof Input>,
    "value" | "onChange" | "onBlur" | "name" | "id"
  >) {
  const { isInvalid, errors } = useFieldState(field);

  return (
    <Field data-invalid={isInvalid}>
      <Label label={label} optional={optional} htmlFor={field.name} />
      <Input
        {...inputProps}
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        className="h-10 md:h-9"
      />
      {hint && !isInvalid && <FieldDescription>{hint}</FieldDescription>}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}

export function PasswordField({
  field,
  label,
  hint,
  autoComplete = "current-password",
  placeholder = "••••••••",
}: BaseProps & { autoComplete?: string; placeholder?: string }) {
  const [visible, setVisible] = useState(false);
  const { isInvalid, errors } = useFieldState(field);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <div className="relative">
        <Input
          id={field.name}
          name={field.name}
          type={visible ? "text" : "password"}
          value={field.state.value ?? ""}
          onChange={(event) => field.handleChange(event.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="h-10 pr-10 md:h-9"
        />
        <button
          type="button"
          onClick={() => setVisible((previous) => !previous)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {hint && !isInvalid && <FieldDescription>{hint}</FieldDescription>}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}

export function TextareaField({
  field,
  label,
  hint,
  optional,
  rows = 3,
  placeholder,
}: BaseProps & { rows?: number; placeholder?: string }) {
  const { isInvalid, errors } = useFieldState(field);

  return (
    <Field data-invalid={isInvalid}>
      <Label label={label} optional={optional} htmlFor={field.name} />
      <Textarea
        id={field.name}
        name={field.name}
        rows={rows}
        value={field.state.value ?? ""}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        placeholder={placeholder}
      />
      {hint && !isInvalid && <FieldDescription>{hint}</FieldDescription>}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}

export function SelectField({
  field,
  label,
  hint,
  optional,
  children,
  disabled,
}: BaseProps & { children: ReactNode; disabled?: boolean }) {
  const { isInvalid, errors } = useFieldState(field);

  return (
    <Field data-invalid={isInvalid}>
      <Label label={label} optional={optional} htmlFor={field.name} />
      <NativeSelect
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        disabled={disabled}
        className="h-10 md:h-9"
      >
        {children}
      </NativeSelect>
      {hint && !isInvalid && <FieldDescription>{hint}</FieldDescription>}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}
