import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { hashString } from "@/utils/hub.util";

/**
 * Hubs have no photo in the API, so each one gets a route-map style artwork
 * generated from its id. It is decorative (aria-hidden) and identical on
 * every render, so cards keep one consistent size and style.
 */
export function HubVisual({
  seed,
  zone,
  className,
}: {
  seed: string;
  zone: string;
  className?: string;
}) {
  const hash = hashString(seed);
  const pick = (shift: number, range: number) => ((hash >>> shift) % range) + 1;

  const startY = 20 + pick(0, 60);
  const midY = 20 + pick(5, 60);
  const endY = 20 + pick(10, 60);
  const dotX = 80 + pick(15, 120);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-32 w-full shrink-0 overflow-hidden bg-ink text-ink-foreground",
        className,
      )}
    >
      <div className="cg-grid-ink absolute inset-0" />
      <svg
        viewBox="0 0 280 128"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full text-primary"
        fill="none"
      >
        <title>{`${zone} hub route illustration`}</title>
        <path
          d={`M0 ${startY} C 70 ${midY}, 150 ${endY + 30}, 280 ${endY}`}
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5 6"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle cx={dotX} cy={midY + 14} r="4" fill="currentColor" />
        <circle
          cx={dotX}
          cy={midY + 14}
          r="10"
          stroke="currentColor"
          opacity="0.35"
        />
      </svg>
      <span className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
        <Building2 className="size-5" />
      </span>
      <span className="absolute right-3 bottom-3 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium ring-1 ring-white/15">
        {zone}
      </span>
    </div>
  );
}
