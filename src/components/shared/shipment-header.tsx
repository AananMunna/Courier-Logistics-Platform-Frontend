import type { ReactNode } from "react";
import { ShipmentProgress } from "@/components/shared/shipment-progress";
import type { ShipmentStatus } from "@/types";

interface Props {
  trackingCode: string;
  status: ShipmentStatus;
  /** One line under the code (booking date, status description…). */
  subtitle: string;
  /** Badges shown on the right. */
  badges: ReactNode;
  /** Copy button or other small action next to the code. */
  codeAction?: ReactNode;
  /** Extra content such as failure alerts. */
  children?: ReactNode;
}

/** Dark header shared by the private shipment page and the public tracking page. */
export function ShipmentHeader({
  trackingCode,
  status,
  subtitle,
  badges,
  codeAction,
  children,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-ink p-5 text-ink-foreground md:p-8">
      <div
        aria-hidden="true"
        className="cg-grid-ink absolute inset-0 [mask-image:radial-gradient(ellipse_at_85%_0%,#000,transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-10 size-56 rounded-full bg-primary/25 blur-3xl"
      />
      <div className="relative space-y-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-ink-foreground/60">Tracking code</p>
            <div className="flex items-center gap-1">
              <h1 className="font-mono text-2xl font-semibold tracking-tight md:text-3xl">
                {trackingCode}
              </h1>
              {codeAction}
            </div>
            <p className="text-sm text-ink-foreground/70">{subtitle}</p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {badges}
          </div>
        </div>
        <ShipmentProgress status={status} onDark />
        {children}
      </div>
    </section>
  );
}
