"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

interface ReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  label?: string;
  placeholder?: string;
  confirmLabel: string;
  destructive?: boolean;
  /** When false the reason may be left empty. */
  required?: boolean;
  minLength?: number;
  isPending?: boolean;
  onConfirm: (reason: string) => void;
}

export function ReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  label = "Reason",
  placeholder,
  confirmLabel,
  destructive,
  required = true,
  minLength = 3,
  isPending,
  onConfirm,
}: ReasonDialogProps) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = reason.trim();
  const tooShort = required ? trimmed.length < minLength : false;
  const tooLong = trimmed.length > 500;
  const error =
    touched && tooShort
      ? `${label} must be at least ${minLength} characters.`
      : tooLong
        ? "Please keep it under 500 characters."
        : null;

  const handleOpenChange = (next: boolean) => {
    if (isPending) {
      return;
    }
    if (!next) {
      setReason("");
      setTouched(false);
    }
    onOpenChange(next);
  };

  const handleConfirm = () => {
    setTouched(true);
    if (tooShort || tooLong) {
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-1.5">
          <label htmlFor="reason-input" className="text-sm font-medium">
            {label}
            {!required && (
              <span className="font-normal text-muted-foreground">
                {" "}
                (optional)
              </span>
            )}
          </label>
          <Textarea
            id="reason-input"
            rows={4}
            value={reason}
            disabled={isPending}
            placeholder={placeholder}
            aria-invalid={!!error}
            onChange={(event) => setReason(event.target.value)}
            onBlur={() => setTouched(true)}
            autoFocus
          />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Go back
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
