import { Check, X } from "lucide-react";
import { SHIPMENT_FLOW, SHIPMENT_STATUS } from "@/constants";
import { cn } from "@/lib/utils";
import type { ShipmentStatus } from "@/types";
import { getFlowIndex } from "@/utils/shipment.util";

const COMPACT_LABEL: Record<string, string> = {
  PENDING: "Booked",
  ASSIGNED: "Assigned",
  PICKED_UP: "Picked up",
  IN_TRANSIT: "In transit",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
};

interface Props {
  status: ShipmentStatus;
  /** Use light-on-dark colours when placed on the ink header card. */
  onDark?: boolean;
}

/** Shows the whole journey at a glance, with the active step pulsing. */
export function ShipmentProgress({ status, onDark = false }: Props) {
  const exception =
    status === "FAILED" || status === "RETURNED" || status === "CANCELLED";
  const currentIndex = getFlowIndex(status);

  if (exception) {
    const meta = SHIPMENT_STATUS[status];
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4">
        <span className="rounded-full bg-destructive/15 p-2 text-destructive">
          <X className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-medium">{meta.label}</p>
          <p
            className={cn(
              "text-sm",
              onDark ? "text-ink-foreground/70" : "text-muted-foreground",
            )}
          >
            {meta.description}
          </p>
        </div>
      </div>
    );
  }

  const muted = onDark ? "text-ink-foreground/50" : "text-muted-foreground";
  const track = onDark ? "bg-white/15" : "bg-border";

  return (
    <ol className="grid grid-cols-6 gap-1" aria-label="Shipment progress">
      {SHIPMENT_FLOW.map((step, index) => {
        const done = index < currentIndex || status === "DELIVERED";
        const current = index === currentIndex && status !== "DELIVERED";

        return (
          <li
            key={step}
            aria-current={current ? "step" : undefined}
            className="relative flex flex-col items-center gap-1.5 text-center"
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-3.5 right-1/2 h-0.5 w-full -translate-y-1/2 overflow-hidden rounded-full",
                  track,
                )}
              >
                <span
                  className={cn(
                    "block h-full w-full origin-left bg-primary transition-transform duration-700",
                    index <= currentIndex ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </span>
            )}
            <span className="relative z-10 flex size-7 items-center justify-center">
              {current && (
                <span className="cg-ping absolute inset-0 rounded-full bg-primary/40" />
              )}
              <span
                className={cn(
                  "relative flex size-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors duration-500",
                  done && "border-primary bg-primary text-primary-foreground",
                  current &&
                    (onDark
                      ? "border-primary bg-ink text-primary"
                      : "border-primary bg-background text-primary"),
                  !done &&
                    !current &&
                    (onDark
                      ? "border-white/20 bg-ink text-ink-foreground/50"
                      : "border-border bg-background text-muted-foreground"),
                )}
              >
                {done ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
            </span>
            <span
              className={cn(
                "text-[10px] leading-tight sm:text-xs",
                done || current ? "font-medium" : muted,
              )}
            >
              {COMPACT_LABEL[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
