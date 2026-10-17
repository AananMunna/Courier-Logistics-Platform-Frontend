import { format } from "date-fns";
import { CalendarDays, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import type { Hub } from "@/types";
import { hubSummary, isRecentHub } from "@/utils/hub.util";
import { HubVisual } from "./hub-visual";

/** Every hub card has the same height, radius and layout; text is clamped to keep it that way. */
export function HubCard({ hub }: { hub: Hub }) {
  return (
    <Card className="group h-full gap-0 py-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-30px_rgb(15_23_42/0.35)]">
      <HubVisual seed={hub.id} zone={hub.zone} />
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="line-clamp-1 font-semibold">{hub.name}</h2>
          {isRecentHub(hub) && <Badge variant="info">New</Badge>}
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {hubSummary(hub)}
        </p>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{hub.address}</span>
          </li>
          <li className="flex items-center gap-2">
            <Phone className="size-4 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">
              {hub.contactNumber || "No phone listed"}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
            Added {format(new Date(hub.createdAt), "d MMM yyyy")}
          </li>
        </ul>
        <LinkButton
          href={`/hubs/${hub.id}`}
          variant="outline"
          className="mt-auto w-full"
          aria-label={`View details for ${hub.name}`}
        >
          View Details
        </LinkButton>
      </CardContent>
    </Card>
  );
}

export function HubCardSkeleton() {
  return (
    <div className="h-[24rem] animate-pulse rounded-2xl bg-muted ring-1 ring-foreground/[0.07]" />
  );
}
