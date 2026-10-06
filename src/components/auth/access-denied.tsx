import { ShieldAlert } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { ROLE_HOME } from "@/constants";
import type { UserRole } from "@/types";

export default function AccessDenied({ role }: { role?: UserRole }) {
  return (
    <div className="flex h-screen w-full items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <span className="rounded-3xl bg-destructive/10 p-5 ring-8 ring-destructive/5">
          <ShieldAlert className="size-9 text-destructive" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-balance">
            This area is not for your account
          </h1>
          <p className="text-sm text-muted-foreground">
            You&apos;re signed in, but your role doesn&apos;t have access to
            this page.
          </p>
        </div>
        <div className="flex gap-2">
          {role && (
            <LinkButton href={ROLE_HOME[role]}>Go to my dashboard</LinkButton>
          )}
          <LinkButton variant="outline" href="/">
            Home
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
