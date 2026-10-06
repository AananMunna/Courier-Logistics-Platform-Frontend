"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  defaultValue?: string;
  className?: string;
  size?: "default" | "large";
}

/** Tracking-code search box (home hero, track page, headers). */
export default function TrackForm({
  defaultValue = "",
  className,
  size = "default",
}: Props) {
  const router = useRouter();
  const [code, setCode] = useState(defaultValue);
  const large = size === "large";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) {
      router.push(`/track?${new URLSearchParams({ code: trimmed })}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex w-full gap-2", className)}
    >
      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          aria-label="Tracking code"
          placeholder="Enter tracking code, e.g. CR-2026-123456"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          className={cn(
            "pl-9 uppercase placeholder:normal-case",
            large ? "h-12 rounded-xl bg-card text-base shadow-sm" : "h-10",
          )}
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className={large ? "h-12 rounded-xl px-6 text-base" : "h-10"}
        disabled={!code.trim()}
      >
        Track
      </Button>
    </form>
  );
}
