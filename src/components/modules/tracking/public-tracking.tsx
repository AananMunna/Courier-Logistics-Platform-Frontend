"use client";

import { MapPin, PackageSearch, SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { RouteLine } from "@/components/shared/route-line";
import { ShipmentHeader } from "@/components/shared/shipment-header";
import { ShipmentTimeline } from "@/components/shared/shipment-timeline";
import { ShipmentStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PARCEL_TYPE_LABEL, SHIPMENT_STATUS } from "@/constants";
import { usePublicTracking } from "@/hooks";
import { ApiError } from "@/lib/apiClient";
import { formatDateTime } from "@/utils";

function TrackingSkeleton() {
  return (
    <div
      className="space-y-4"
      aria-busy="true"
      aria-label="Loading tracking details"
    >
      <Skeleton className="h-48 rounded-3xl" />
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

export default function PublicTracking() {
  const code = (useSearchParams().get("code") ?? "").trim().toUpperCase();
  const { data, isPending, error, refetch } = usePublicTracking(code);

  if (!code) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Enter a tracking code"
        description="You'll find it in your booking confirmation. It looks like CR-2026-123456."
      />
    );
  }

  if (isPending) {
    return <TrackingSkeleton />;
  }

  if (error) {
    if (error instanceof ApiError && error.status === 404) {
      return (
        <EmptyState
          icon={SearchX}
          title="No shipment found"
          description={`We couldn't find a parcel with the code "${code}". Please check it and try again.`}
        />
      );
    }
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const shipment = data.data;
  const meta = SHIPMENT_STATUS[shipment.status];

  return (
    <div className="space-y-4">
      <ShipmentHeader
        trackingCode={shipment.trackingCode}
        status={shipment.status}
        subtitle={meta.description}
        badges={<ShipmentStatusBadge status={shipment.status} />}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden="true" />{" "}
              Route
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RouteLine
              from={{
                title: shipment.originHub.name,
                subtitle: `${shipment.originHub.zone} · ${shipment.pickupAddress}`,
              }}
              to={{
                title: shipment.destinationHub.name,
                subtitle: `${shipment.destinationHub.zone} · ${shipment.deliveryAddress}`,
              }}
            />
            <dl className="grid grid-cols-2 gap-3 border-t pt-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Parcel type</dt>
                <dd className="font-medium">
                  {PARCEL_TYPE_LABEL[shipment.parcelType]}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Booked</dt>
                <dd className="font-medium">
                  {formatDateTime(shipment.createdAt)}
                </dd>
              </div>
              {shipment.deliveredAt && (
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Delivered</dt>
                  <dd className="font-medium">
                    {formatDateTime(shipment.deliveredAt)}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tracking history</CardTitle>
          </CardHeader>
          <CardContent>
            <ShipmentTimeline events={shipment.trackingEvents} />
          </CardContent>
        </Card>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Updates automatically every 30 seconds.
      </p>
    </div>
  );
}
