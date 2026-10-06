import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  align = "left",
  invert = false,
}: {
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  invert?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-3",
        align === "center" && "mx-auto text-center",
      )}
    >
      <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base text-pretty md:text-lg",
            invert ? "text-ink-foreground/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
