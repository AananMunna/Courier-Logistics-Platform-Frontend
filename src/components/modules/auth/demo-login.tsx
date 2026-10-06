"use client";

import { Bike, Rocket, ShieldCheck, UserRound } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { type DemoAccount, demoAccounts } from "@/config/demo-accounts";
import { cn } from "@/lib/utils";

const ICONS = { ADMIN: ShieldCheck, CUSTOMER: UserRound, RIDER: Bike } as const;

interface Props {
  onSelect: (account: DemoAccount) => void;
  pendingRole: DemoAccount["role"] | null;
  disabled: boolean;
}

export function DemoLogin({ onSelect, pendingRole, disabled }: Props) {
  return (
    <section aria-labelledby="demo-heading" className="space-y-3">
      <h2
        id="demo-heading"
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground"
      >
        <Rocket className="size-4" aria-hidden="true" /> Quick demo login
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {demoAccounts.map((account) => {
          const Icon = ICONS[account.role];
          const pending = pendingRole === account.role;

          return (
            <button
              key={account.role}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(account)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border bg-card p-3 text-center transition-all hover:-translate-y-0.5",
                "hover:border-primary/40 hover:bg-primary/5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              <span className="rounded-full bg-primary/10 p-2 text-primary">
                {pending ? (
                  <Spinner />
                ) : (
                  <Icon className="size-4" aria-hidden="true" />
                )}
              </span>
              <span className="text-sm font-medium">{account.label}</span>
              <span className="hidden text-[11px] leading-tight text-muted-foreground sm:block">
                {account.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
