"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateShipment, useCurrentUser } from "@/hooks";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import type { CreateShipmentPayload } from "@/types";
import { normalizePhone } from "@/utils";
import { StepParcel } from "./step-parcel";
import { StepPickup } from "./step-pickup";
import { StepReceiver } from "./step-receiver";
import { StepReview } from "./step-review";
import {
  EMPTY_PARCEL,
  EMPTY_PICKUP,
  EMPTY_RECEIVER,
  WIZARD_STEPS,
  type WizardValues,
} from "./wizard-types";

export default function CreateShipmentWizard() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { mutate: create, isPending } = useCreateShipment();
  const [step, setStep] = useState(0);

  // Pre-fill the pickup contact from the customer's profile (saves typing).
  const initialPickup = useMemo(
    () => ({
      ...EMPTY_PICKUP,
      pickupContactName: user?.name ?? "",
      pickupContactPhone: user?.customer?.contactNumber ?? "",
      pickupAddress: user?.customer?.address ?? "",
    }),
    [user],
  );

  const [values, setValues] = useState<WizardValues>({
    pickup: initialPickup,
    receiver: EMPTY_RECEIVER,
    parcel: EMPTY_PARCEL,
  });

  const next = () =>
    setStep((current) => Math.min(current + 1, WIZARD_STEPS.length - 1));
  const back = () => setStep((current) => Math.max(current - 1, 0));

  const submit = () => {
    const { pickup, receiver, parcel } = values;
    const distance = Number(parcel.distanceKm);

    const payload: CreateShipmentPayload = {
      originHubId: pickup.originHubId,
      destinationHubId: pickup.destinationHubId,
      pickupAddress: pickup.pickupAddress.trim(),
      pickupContactName: pickup.pickupContactName.trim(),
      pickupContactPhone: normalizePhone(pickup.pickupContactPhone),
      deliveryAddress: receiver.deliveryAddress.trim(),
      deliveryContactName: receiver.deliveryContactName.trim(),
      deliveryContactPhone: normalizePhone(receiver.deliveryContactPhone),
      parcelType: parcel.parcelType,
      weightKg: Number(parcel.weightKg),
      isCod: parcel.isCod,
      ...(parcel.isCod ? { codAmount: Number(parcel.codAmount) } : {}),
      ...(parcel.parcelDescription.trim()
        ? { parcelDescription: parcel.parcelDescription.trim() }
        : {}),
      ...(distance > 0 ? { distanceKm: distance } : {}),
      ...(pickup.scheduledPickupAt
        ? {
            scheduledPickupAt: new Date(pickup.scheduledPickupAt).toISOString(),
          }
        : {}),
    };

    create(payload, {
      onSuccess: (response) => {
        notify.success(
          "Shipment booked",
          `Tracking code ${response.data.trackingCode}`,
        );
        router.replace(`/dashboard/shipments/${response.data.id}`);
      },
      onError: (error) => notify.error("Couldn't book your shipment", error),
    });
  };

  return (
    <div className="space-y-4">
      <ol className="flex items-center" aria-label="Booking steps">
        {WIZARD_STEPS.map((label, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li
              key={label}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex items-center",
                index < WIZARD_STEPS.length - 1 && "flex-1",
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300",
                    done && "bg-primary text-primary-foreground",
                    current &&
                      "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !done && !current && "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "hidden text-sm sm:inline",
                    current ? "font-semibold" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </span>
              {index < WIZARD_STEPS.length - 1 && (
                <span className="mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                  <span
                    className={cn(
                      "block h-full bg-primary transition-all duration-500",
                      done ? "w-full" : "w-0",
                    )}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <Card>
        <CardContent key={step} className="cg-pop">
          {step === 0 && (
            <StepPickup
              defaultValues={values.pickup}
              onNext={(pickup) => {
                setValues((previous) => ({ ...previous, pickup }));
                next();
              }}
            />
          )}
          {step === 1 && (
            <StepReceiver
              defaultValues={values.receiver}
              onBack={back}
              onNext={(receiver) => {
                setValues((previous) => ({ ...previous, receiver }));
                next();
              }}
            />
          )}
          {step === 2 && (
            <StepParcel
              defaultValues={values.parcel}
              onBack={back}
              onNext={(parcel) => {
                setValues((previous) => ({ ...previous, parcel }));
                next();
              }}
            />
          )}
          {step === 3 && (
            <StepReview
              values={values}
              isPending={isPending}
              onBack={back}
              onSubmit={submit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
