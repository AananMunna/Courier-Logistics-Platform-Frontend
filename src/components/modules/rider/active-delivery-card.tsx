"use client";

import { Navigation, PackageOpen, Phone } from "lucide-react";
import Link from "next/link";
import { RouteLine } from "@/components/shared/route-line";
import { ShipmentStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useShipmentList } from "@/hooks";
import type { Shipment, ShipmentStatus } from "@/types";
import { getShipmentHref, mapsSearchUrl, normalizePhone } from "@/utils";
import { StatusActions } from "../shipments/actions/status-actions";

const ACTIVE: ShipmentStatus[] = ["OUT_FOR_DELIVERY", "IN_TRANSIT", "PICKED_UP"];

function pickActive(shipments: Shipment[]) {
  for (const status of ACTIVE) {
    const hit = shipments.find((s) => s.status === status);
    if (hit) {
      return hit;
    }
  }
  // Nothing picked up yet: the next thing to do is the pickup.
  return shipments.find((s) => s.status === "ASSIGNED");
}

/** The one parcel the rider should be thinking about right now. */
export function ActiveDeliveryCard() {
  const { data, isPending } = useShipmentList("rider", {
    page: 1,
    limit: 20,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  if (isPending) {
    return <Skeleton className="h-64 rounded-2xl" />;
  }

  const shipment = pickActive(data?.data ?? []);

  if (!shipment) {
    return (
      <Card>
        <CardContent className="flex items-center gap-4 py-6">
          <span className="rounded-2xl bg-primary/10 p-3 text-primary">
            <PackageOpen className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold">No active delivery</p>
            <p className="text-sm text-muted-foreground">
              New assignments from the admin team will show up here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const toPickup = shipment.status === "ASSIGNED";
  const address = toPickup ? shipment.pickupAddress : shipment.deliveryAddress;
  const contactName = toPickup
    ? shipment.pickupContactName
    : shipment.deliveryContactName;
  const phone = toPickup
    ? shipment.pickupContactPhone
    : shipment.deliveryContactPhone;

  return (
    <Card className="ring-2 ring-primary/20">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-primary">
              {toPickup ? "Next: pick up" : "Active delivery"}
            </p>
            <Link
              href={getShipmentHref("rider", shipment.id)}
              className="font-mono text-lg font-semibold hover:underline"
            >
              {shipment.trackingCode}
            </Link>
          </div>
          <ShipmentStatusBadge status={shipment.status} />
        </div>

        <RouteLine
          from={{ title: shipment.pickupAddress }}
          to={{ title: shipment.deliveryAddress }}
        />

        <p className="text-sm text-muted-foreground">
          {toPickup ? "Sender" : "Receiver"}:{" "}
          <span className="font-medium text-foreground">{contactName}</span>
        </p>

        <div className="grid grid-cols-2 gap-3">
          <LinkButton
            href={`tel:${normalizePhone(phone)}`}
            variant="outline"
            className="h-12 text-base"
          >
            <Phone /> {toPickup ? "Call sender" : "Call receiver"}
          </LinkButton>
          <LinkButton
            href={mapsSearchUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="h-12 text-base"
          >
            <Navigation /> Navigate
          </LinkButton>
        </div>

        <div className="flex flex-wrap gap-2 [&_button]:h-12 [&_button]:text-base">
          <StatusActions shipment={shipment} />
        </div>
      </CardContent>
    </Card>
  );
}
