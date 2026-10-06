import { SHIPMENT_STATUS } from "@/constants";
import { cn } from "@/lib/utils";
import type { ShipmentStatus } from "@/types";
import { formatDateTime } from "@/utils/format.util";

interface TimelineEvent {
  id?: string;
  status: ShipmentStatus;
  note?: string | null;
  createdAt: string;
  updatedByName?: string | null;
}

/** Newest event first, like the backend returns it. */
export function ShipmentTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No updates yet.
      </p>
    );
  }

  return (
    <ol className="relative space-y-6 border-l pl-6">
      {events.map((event, index) => {
        const meta = SHIPMENT_STATUS[event.status];
        return (
          <li
            key={event.id ?? `${event.status}-${event.createdAt}-${index}`}
            className="relative"
          >
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[29px] flex size-3 items-center justify-center"
            >
              {index === 0 && (
                <span
                  className={cn(
                    "cg-ping absolute inset-0 rounded-full opacity-60",
                    meta.dotClass,
                  )}
                />
              )}
              <span
                className={cn(
                  "relative size-3 rounded-full ring-4 ring-card",
                  index === 0 ? meta.dotClass : "bg-border",
                )}
              />
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p
                className={cn(
                  "font-medium",
                  index !== 0 && "text-muted-foreground",
                )}
              >
                {meta.label}
              </p>
              <time
                dateTime={event.createdAt}
                className="text-xs text-muted-foreground"
              >
                {formatDateTime(event.createdAt)}
              </time>
            </div>
            {event.note && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {event.note}
              </p>
            )}
            {event.updatedByName && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                by {event.updatedByName}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
