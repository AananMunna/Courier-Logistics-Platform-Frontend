"use client";

import { ArrowLeft, ExternalLink, MapPin, Phone, SearchX } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageContainer } from "@/components/shared/page-header";
import { RouteLine } from "@/components/shared/route-line";
import { ShipmentHeader } from "@/components/shared/shipment-header";
import { ShipmentTimeline } from "@/components/shared/shipment-timeline";
import {
  PaymentStatusBadge,
  ShipmentStatusBadge,
} from "@/components/shared/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { Skeleton } from "@/components/ui/skeleton";
import { PARCEL_TYPE_LABEL, VEHICLE_TYPE_LABEL } from "@/constants";
import { useShipment } from "@/hooks";
import { ApiError } from "@/lib/apiClient";
import type { Shipment } from "@/types";
import {
  canCancelShipment,
  canPayShipment,
  formatCurrency,
  formatDateTime,
  mapsSearchUrl,
  toNumber,
} from "@/utils";
import { AdminActions } from "./actions/admin-actions";
import { CancelShipmentButton } from "./actions/cancel-shipment";
import { PayButton } from "./actions/pay-button";
import { StatusActions } from "./actions/status-actions";
import { AddNoteForm } from "./add-note-form";
import type { ShipmentViewRole } from "./shipment-list";

const BACK: Record<ShipmentViewRole, { href: string; label: string }> = {
  admin: { href: "/admin/shipments", label: "All shipments" },
  customer: { href: "/dashboard/shipments", label: "My shipments" },
  rider: { href: "/rider/shipments", label: "My shipments" },
};

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium break-words">{children}</dd>
    </div>
  );
}

function ContactBlock({
  title,
  name,
  phone,
  address,
}: {
  title: string;
  name: string;
  phone: string;
  address: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-semibold text-muted-foreground">{title}</p>
      <p className="font-medium">{name}</p>
      <a
        href={`tel:${phone}`}
        className="flex w-fit items-center gap-1.5 text-sm text-primary hover:underline"
      >
        <Phone className="size-3.5" aria-hidden="true" /> {phone}
      </a>
      <a
        href={mapsSearchUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>
          {address}{" "}
          <ExternalLink className="ml-0.5 inline size-3" aria-hidden="true" />
        </span>
      </a>
    </div>
  );
}

function ActionPanel({
  shipment,
  role,
}: {
  shipment: Shipment;
  role: ShipmentViewRole;
}) {
  if (role === "customer") {
    const payable = canPayShipment(shipment);
    const cancellable = canCancelShipment(shipment.status);
    if (!payable && !cancellable) {
      return null;
    }
    return (
      <Card>
        <CardHeader>
          <CardTitle>{payable ? "Complete your booking" : "Manage"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {payable && <PayButton shipment={shipment} />}
          {payable && shipment.isCod && (
            <p className="text-xs text-muted-foreground">
              Cash on delivery is also set — the receiver pays{" "}
              {formatCurrency(shipment.codAmount)} on delivery.
            </p>
          )}
          {cancellable && <CancelShipmentButton shipmentId={shipment.id} />}
        </CardContent>
      </Card>
    );
  }

  if (role === "rider") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Next step</CardTitle>
        </CardHeader>
        <CardContent>
          {["DELIVERED", "RETURNED", "CANCELLED"].includes(shipment.status) ? (
            <p className="text-sm text-muted-foreground">
              Nothing left to do for this shipment.
            </p>
          ) : (
            <StatusActions shipment={shipment} />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <AdminActions shipment={shipment} />
      </CardContent>
    </Card>
  );
}

function DetailSkeleton() {
  return (
    <PageContainer>
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-48 rounded-3xl" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </PageContainer>
  );
}

export default function ShipmentDetail({
  id,
  role,
}: {
  id: string;
  role: ShipmentViewRole;
}) {
  const { data, isPending, error, refetch } = useShipment(id);
  const back = BACK[role];

  if (isPending) {
    return <DetailSkeleton />;
  }

  if (error || !data) {
    const notFound =
      error instanceof ApiError &&
      (error.status === 404 || error.status === 403);
    return (
      <PageContainer>
        <div className="rounded-2xl border bg-card">
          {notFound ? (
            <EmptyState
              icon={SearchX}
              title="Shipment not found"
              description="It may have been deleted, or it isn't assigned to your account."
              action={
                <LinkButton href={back.href}>
                  Back to {back.label.toLowerCase()}
                </LinkButton>
              }
            />
          ) : (
            <ErrorState error={error} onRetry={() => refetch()} />
          )}
        </div>
      </PageContainer>
    );
  }

  const shipment = data.data;
  const events = shipment.trackingEvents ?? [];
  const canNote =
    role !== "customer" &&
    !["DELIVERED", "CANCELLED"].includes(shipment.status);

  return (
    <PageContainer>
      <Link
        href={back.href}
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {back.label}
      </Link>

      <ShipmentHeader
        trackingCode={shipment.trackingCode}
        status={shipment.status}
        subtitle={`Booked ${formatDateTime(shipment.createdAt)}`}
        codeAction={
          <CopyButton
            value={shipment.trackingCode}
            label="Copy tracking code"
            className="text-ink-foreground/70 hover:bg-white/10 hover:text-ink-foreground"
          />
        }
        badges={
          <>
            <ShipmentStatusBadge status={shipment.status} />
            {role !== "rider" && (
              <PaymentStatusBadge status={shipment.payment?.status} />
            )}
          </>
        }
      >
        {shipment.failureReason && shipment.status === "FAILED" && (
          <Alert variant="destructive">
            <AlertTitle>Delivery failed</AlertTitle>
            <AlertDescription>{shipment.failureReason}</AlertDescription>
          </Alert>
        )}
        {shipment.cancelReason && shipment.status === "CANCELLED" && (
          <Alert>
            <AlertTitle>Cancelled</AlertTitle>
            <AlertDescription>{shipment.cancelReason}</AlertDescription>
          </Alert>
        )}
      </ShipmentHeader>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Route & contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RouteLine
                from={{
                  title: shipment.originHub?.name ?? "Origin hub",
                  subtitle: shipment.originHub?.zone,
                }}
                to={{
                  title: shipment.destinationHub?.name ?? "Destination hub",
                  subtitle: shipment.destinationHub?.zone,
                }}
              />
              <div className="grid gap-6 border-t pt-5 sm:grid-cols-2">
                <ContactBlock
                  title="Pickup"
                  name={shipment.pickupContactName}
                  phone={shipment.pickupContactPhone}
                  address={shipment.pickupAddress}
                />
                <ContactBlock
                  title="Deliver to"
                  name={shipment.deliveryContactName}
                  phone={shipment.deliveryContactPhone}
                  address={shipment.deliveryAddress}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tracking history</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ShipmentTimeline events={events} />
              {canNote && (
                <div className="border-t pt-5">
                  <AddNoteForm shipmentId={shipment.id} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:sticky lg:top-20">
          <ActionPanel shipment={shipment} role={role} />

          <Card>
            <CardHeader>
              <CardTitle>Parcel</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2.5">
                <DetailRow label="Type">
                  {PARCEL_TYPE_LABEL[shipment.parcelType]}
                </DetailRow>
                <DetailRow label="Weight">
                  {toNumber(shipment.weightKg)} kg
                </DetailRow>
                {shipment.distanceKm != null && (
                  <DetailRow label="Distance">
                    {toNumber(shipment.distanceKm)} km
                  </DetailRow>
                )}
                {shipment.parcelDescription && (
                  <DetailRow label="Contents">
                    {shipment.parcelDescription}
                  </DetailRow>
                )}
                {shipment.scheduledPickupAt && (
                  <DetailRow label="Pickup time">
                    {formatDateTime(shipment.scheduledPickupAt)}
                  </DetailRow>
                )}
                {shipment.deliveredAt && (
                  <DetailRow label="Delivered">
                    {formatDateTime(shipment.deliveredAt)}
                  </DetailRow>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2.5">
                <DetailRow label="Delivery fee">
                  {formatCurrency(shipment.deliveryFee)}
                </DetailRow>
                {shipment.isCod && (
                  <DetailRow label="Cash to collect">
                    {formatCurrency(shipment.codAmount)}
                  </DetailRow>
                )}
                {role !== "rider" && (
                  <>
                    <DetailRow label="Method">
                      {shipment.payment?.method === "BKASH"
                        ? "bKash"
                        : shipment.payment?.method === "COD"
                          ? "Cash on delivery"
                          : "—"}
                    </DetailRow>
                    {shipment.payment?.bkashTrxId && (
                      <DetailRow label="bKash TrxID">
                        {shipment.payment.bkashTrxId}
                      </DetailRow>
                    )}
                    {shipment.payment?.refundedAt && (
                      <DetailRow label="Refunded">
                        {formatDateTime(shipment.payment.refundedAt)}
                      </DetailRow>
                    )}
                  </>
                )}
              </dl>
            </CardContent>
          </Card>

          {(role === "admin" || role === "customer") && (
            <Card>
              <CardHeader>
                <CardTitle>Rider</CardTitle>
              </CardHeader>
              <CardContent>
                {shipment.rider ? (
                  <dl className="space-y-2.5">
                    <DetailRow label="Name">{shipment.rider.name}</DetailRow>
                    <DetailRow label="Vehicle">
                      {VEHICLE_TYPE_LABEL[shipment.rider.vehicleType]}
                    </DetailRow>
                    {shipment.rider.contactNumber && (
                      <DetailRow label="Phone">
                        <a
                          href={`tel:${shipment.rider.contactNumber}`}
                          className="text-primary hover:underline"
                        >
                          {shipment.rider.contactNumber}
                        </a>
                      </DetailRow>
                    )}
                  </dl>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    A rider hasn&apos;t been assigned yet.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {role === "admin" && shipment.customer && (
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2.5">
                  <DetailRow label="Name">{shipment.customer.name}</DetailRow>
                  <DetailRow label="Email">{shipment.customer.email}</DetailRow>
                  {shipment.customer.contactNumber && (
                    <DetailRow label="Phone">
                      {shipment.customer.contactNumber}
                    </DetailRow>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
