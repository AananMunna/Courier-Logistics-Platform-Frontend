import { MapPin } from "lucide-react";

interface RouteLineProps {
  from: { title: string; subtitle?: string };
  to: { title: string; subtitle?: string };
}

/** Compact pickup → delivery visual used on cards and detail pages. */
export function RouteLine({ from, to }: RouteLineProps) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-1" aria-hidden="true">
        <span className="size-3 rounded-full bg-primary ring-4 ring-primary/15" />
        <span className="my-1 w-px flex-1 border-l-2 border-dotted border-primary/30" />
        <MapPin className="size-4 text-primary" />
      </div>
      <div className="min-w-0 space-y-3">
        <div>
          <p className="truncate text-sm font-medium">{from.title}</p>
          {from.subtitle && (
            <p className="truncate text-xs text-muted-foreground">
              {from.subtitle}
            </p>
          )}
        </div>
        <div>
          <p className="truncate text-sm font-medium">{to.title}</p>
          {to.subtitle && (
            <p className="truncate text-xs text-muted-foreground">
              {to.subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
