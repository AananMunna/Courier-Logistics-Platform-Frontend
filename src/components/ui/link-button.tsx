import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

type LinkButtonProps = Omit<ComponentProps<typeof Link>, "className"> &
  VariantProps<typeof buttonVariants> & { className?: string };

/** A <Link> that looks like a <Button>. Avoids nested interactive elements. */
export function LinkButton({
  variant,
  size,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
