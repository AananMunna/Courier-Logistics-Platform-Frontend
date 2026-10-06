import type { ReactNode } from "react";

interface DashboardHeroProps {
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
}

/** Dark banner at the top of each role's overview page. */
export function DashboardHero({
  title,
  description,
  actions,
  aside,
}: DashboardHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-ink p-6 text-ink-foreground md:p-9">
      <div
        aria-hidden="true"
        className="cg-grid-ink absolute inset-0 [mask-image:radial-gradient(ellipse_at_80%_20%,#000,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-10 size-64 rounded-full bg-primary/30 blur-3xl"
      />
      <div className="relative grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            {title}
          </h1>
          <p className="max-w-md text-sm text-ink-foreground/70">
            {description}
          </p>
          {actions && (
            <div className="flex flex-wrap gap-2 pt-3">{actions}</div>
          )}
        </div>
        {aside && (
          <div className="rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10">
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
