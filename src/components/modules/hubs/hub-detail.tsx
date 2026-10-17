"use client";

import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  MapPin,
  PackagePlus,
  PackageSearch,
  Phone,
  SearchX,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveHubs, useHub } from "@/hooks";
import { ApiError } from "@/lib/apiClient";
import { hubMapsUrl, hubSummary } from "@/utils/hub.util";
import { HubCard } from "./hub-card";
import { HubVisual } from "./hub-visual";

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="rounded-lg bg-primary/10 p-2 text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
        <dd className="text-sm break-words">{children}</dd>
      </div>
    </div>
  );
}

export default function HubDetail({ id }: { id: string }) {
  const { data, isPending, error, refetch } = useHub(id);
  const { data: allHubs } = useActiveHubs();
  const hub = data?.data;

  const related = useMemo(() => {
    if (!hub) {
      return [];
    }
    return (allHubs?.data ?? [])
      .filter((other) => other.id !== hub.id)
      .sort((a, b) => {
        const sameA = a.zone === hub.zone ? 0 : 1;
        const sameB = b.zone === hub.zone ? 0 : 1;
        return sameA - sameB || a.name.localeCompare(b.name);
      })
      .slice(0, 4);
  }, [allHubs, hub]);

  const notFound = error instanceof ApiError && error.status === 404;

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:py-16">
      <Link
        href="/hubs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> All hubs
      </Link>

      {isPending ? (
        <DetailSkeleton />
      ) : notFound || (!error && !hub) ? (
        <EmptyState
          icon={SearchX}
          title="We couldn't find that hub"
          description="It may have been removed or is no longer active."
          action={<LinkButton href="/hubs">Browse all hubs</LinkButton>}
        />
      ) : error || !hub ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <>
          <header className="overflow-hidden rounded-3xl ring-1 ring-foreground/[0.07]">
            <HubVisual seed={hub.id} zone={hub.zone} className="h-40" />
            <div className="flex flex-col gap-4 bg-card p-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight text-balance">
                    {hub.name}
                  </h1>
                  <Badge variant={hub.isActive ? "success" : "secondary"}>
                    {hub.isActive ? "Open for booking" : "Not active"}
                  </Badge>
                </div>
                <p className="max-w-2xl text-muted-foreground">
                  {hubSummary(hub)}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <LinkButton href="/dashboard/shipments/new" size="lg">
                  <PackagePlus /> Book a parcel
                </LinkButton>
                <LinkButton href="/track" variant="outline" size="lg">
                  <PackageSearch /> Track a parcel
                </LinkButton>
              </div>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  {hub.name} is one of our hubs in the {hub.zone} zone. Choose
                  it as the pickup or delivery hub when you book, and the fee is
                  shown before you confirm.
                </p>
                <p>
                  Every status change on a parcel that passes through a hub is
                  timestamped on the public tracking page.
                </p>
                <a
                  href={hubMapsUrl(hub)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                >
                  Open in Maps <ExternalLink className="size-4" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <InfoRow icon={MapPin} label="Zone">
                    {hub.zone}
                  </InfoRow>
                  <InfoRow icon={MapPin} label="Address">
                    {hub.address}
                  </InfoRow>
                  <InfoRow icon={Phone} label="Contact number">
                    {hub.contactNumber ? (
                      <a
                        href={`tel:${hub.contactNumber}`}
                        className="hover:underline"
                      >
                        {hub.contactNumber}
                      </a>
                    ) : (
                      "No phone listed"
                    )}
                  </InfoRow>
                  <InfoRow icon={CalendarDays} label="Added on">
                    {format(new Date(hub.createdAt), "d MMMM yyyy")}
                  </InfoRow>
                </dl>
              </CardContent>
            </Card>
          </div>

          {related.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Related hubs</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((other) => (
                  <li key={other.id}>
                    <HubCard hub={other} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
