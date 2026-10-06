"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 p-6 text-center">
      <span className="cg-float rounded-3xl bg-destructive/10 p-5 ring-8 ring-destructive/5">
        <TriangleAlert
          className="size-10 text-destructive"
          aria-hidden="true"
        />
      </span>
      <div className="max-w-md space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance">
          Something went wrong
        </h1>
        <p className="text-muted-foreground">
          An unexpected error occurred. Please try again — your data is safe.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground">
            Ref: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          size="lg"
          className="h-11 px-5 text-base"
          onClick={reset}
        >
          <RefreshCw /> Try again
        </Button>
        <LinkButton
          href="/"
          variant="outline"
          size="lg"
          className="h-11 px-5 text-base"
        >
          Go home
        </LinkButton>
      </div>
    </div>
  );
}
