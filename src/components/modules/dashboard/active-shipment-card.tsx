"use client";

import { ArrowRight, PackagePlus, Phone, Truck } from "lucide-react";
import Link from "next/link";
import { ShipmentProgress } from "@/components/shared/shipment-progress";
import { ShipmentStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useShipmentList } from "@/hooks";
import type { Shipment } from "@/types";
import {
  canPayShipment,
  formatDate,
  getShipmentHref,
  normalizePhone,
} from "@/utils";
import { PayButton } from "../shipments/actions/pay-button";

const FINAL = ["DELIVERED", "CANCELLED", "RETURNED", "FAILED"];

function pickActive(shipments: Shipment[]) {
  return shipments.find((s) => !FINAL.includes(s.status));
}

/** Most recent parcel that is still on its way, with progress, rider and pay action. */
export function ActiveShipmentCard() {
  const { data, isPending } = useShipmentList("customer", {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (isPending) {
    return <Skeleton className="h-60 rounded-2xl" />;
  }

  const shipment = pickActive(data?.data ?? []);

  if (!shipment) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-4 py-6 sm:flex-row sm:items-center">
          <span className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Truck className="size-6" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="font-semibold">Nothing on the way right now</p>
            <p className="text-sm text-muted-foreground">
              Send a parcel and you can follow every step from here.
            </p>
          </div>
          <LinkButton href="/dashboard/shipments/new" className="h-11">
            <PackagePlus /> Send a parcel
          </LinkButton>
        </CardContent>
      </Card>
    );
  }

  const rider = shipment.rider;

  return (
    <Card className="ring-2 ring-primary/20">
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-primary">On its way</p>
            <Link
              href={getShipmentHref("customer", shipment.id)}
              className="font-mono text-lg font-semibold hover:underline"
            >
              {shipment.trackingCode}
            </Link>
            <p className="truncate text-sm text-muted-foreground">
              To {shipment.deliveryContactName} · booked{" "}
              {formatDate(shipment.createdAt)}
            </p>
          </div>
          <ShipmentStatusBadge status={shipment.status} />
        </div>

        <ShipmentProgress status={shipment.status} />

        {rider && (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Your rider</p>
              <p className="truncate text-sm font-medium">{rider.name}</p>
            </div>
            {rider.contactNumber && (
              <LinkButton
                href={`tel:${normalizePhone(rider.contactNumber)}`}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <Phone /> Call
              </LinkButton>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {canPayShipment(shipment) && <PayButton shipment={shipment} />}
          <LinkButton
            href={getShipmentHref("customer", shipment.id)}
            variant="outline"
            className="h-11"
          >
            View details <ArrowRight />
          </LinkButton>
        </div>
      </CardContent>
    </Card>
  );
}
