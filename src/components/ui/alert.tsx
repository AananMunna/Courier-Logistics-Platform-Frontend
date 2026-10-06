import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative flex w-full items-start gap-3 rounded-2xl border p-4 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        info: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-100",
        warning:
          "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100",
        destructive:
          "border-red-200 bg-red-50 text-red-900 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-100",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("font-medium leading-snug", className)} {...props} />;
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-sm leading-relaxed opacity-90", className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
