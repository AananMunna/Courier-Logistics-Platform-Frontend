"use client";

import { ArrowLeft, Check } from "lucide-react";
import { RouteLine } from "@/components/shared/route-line";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { estimateDeliveryFee } from "@/config/pricing";
import { PARCEL_TYPE_LABEL } from "@/constants";
import { useActiveHubs } from "@/hooks";
import { formatCurrency, formatDateTime } from "@/utils";
import type { WizardValues } from "./wizard-types";

interface Props {
  values: WizardValues;
  isPending: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function StepReview({ values, isPending, onBack, onSubmit }: Props) {
  const { data } = useActiveHubs();
  const hubs = data?.data ?? [];
  const origin = hubs.find((hub) => hub.id === values.pickup.originHubId);
  const destination = hubs.find(
    (hub) => hub.id === values.pickup.destinationHubId,
  );

  const weight = Number(values.parcel.weightKg);
  const distance = Number(values.parcel.distanceKm) || undefined;
  const fee = estimateDeliveryFee(weight, distance);

  return (
    <div className="space-y-6">
      <RouteLine
        from={{
          title: origin?.name ?? "Pickup hub",
          subtitle: values.pickup.pickupAddress,
        }}
        to={{
          title: destination?.name ?? "Delivery hub",
          subtitle: values.receiver.deliveryAddress,
        }}
      />

      <dl className="grid gap-x-6 gap-y-3 rounded-2xl bg-muted/40 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Pickup contact</dt>
          <dd className="font-medium">
            {values.pickup.pickupContactName} ·{" "}
            {values.pickup.pickupContactPhone}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Receiver</dt>
          <dd className="font-medium">
            {values.receiver.deliveryContactName} ·{" "}
            {values.receiver.deliveryContactPhone}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Parcel</dt>
          <dd className="font-medium">
            {PARCEL_TYPE_LABEL[values.parcel.parcelType]} · {weight} kg
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Pickup time</dt>
          <dd className="font-medium">
            {values.pickup.scheduledPickupAt
              ? formatDateTime(values.pickup.scheduledPickupAt)
              : "Earliest available"}
          </dd>
        </div>
        {values.parcel.isCod && (
          <div>
            <dt className="text-muted-foreground">Cash on delivery</dt>
            <dd className="font-medium">
              {formatCurrency(Number(values.parcel.codAmount))}
            </dd>
          </div>
        )}
      </dl>

      <div className="flex items-center justify-between rounded-2xl border-2 border-primary/20 bg-primary/5 p-5">
        <div>
          <p className="text-sm text-muted-foreground">
            Estimated delivery fee
          </p>
          <p className="text-xs text-muted-foreground">
            Final fee is confirmed on the next screen.
          </p>
        </div>
        <p className="text-3xl font-bold tracking-tight text-primary tabular-nums">
          {formatCurrency(fee)}
        </p>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-11 px-4 text-base"
          onClick={onBack}
          disabled={isPending}
        >
          <ArrowLeft /> Back
        </Button>
        <Button
          type="button"
          size="lg"
          className="h-11 px-5 text-base shadow-[0_10px_24px_-12px_var(--primary)]"
          onClick={onSubmit}
          disabled={isPending}
        >
          {isPending ? <Spinner /> : <Check />}
          {isPending ? "Booking…" : "Confirm booking"}
        </Button>
      </div>
    </div>
  );
}
