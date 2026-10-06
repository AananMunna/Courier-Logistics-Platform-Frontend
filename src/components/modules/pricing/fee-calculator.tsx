"use client";

import { Calculator } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkButton } from "@/components/ui/link-button";
import { estimateDeliveryFee, pricingConfig } from "@/config/pricing";
import { formatCurrency } from "@/utils";

export default function FeeCalculator() {
  const [weight, setWeight] = useState("1");
  const [distance, setDistance] = useState("10");

  const weightNumber = Number(weight);
  const distanceNumber = Number(distance);
  const validWeight = weightNumber > 0 && weightNumber <= 1000;
  const fee = validWeight
    ? estimateDeliveryFee(weightNumber, distanceNumber > 0 ? distanceNumber : 0)
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="size-4 text-primary" aria-hidden="true" />{" "}
          Estimate your delivery fee
        </CardTitle>
        <CardDescription>
          Instant estimate — the final fee is shown before you confirm.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="calc-weight">Weight (kg)</Label>
            <Input
              id="calc-weight"
              type="number"
              inputMode="decimal"
              min="0.1"
              step="0.1"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              className="h-10"
              aria-invalid={!validWeight}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="calc-distance">Distance (km)</Label>
            <Input
              id="calc-distance"
              type="number"
              inputMode="decimal"
              min="0"
              step="1"
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
              className="h-10"
            />
          </div>
        </div>

        <div
          className="rounded-2xl bg-primary/5 p-5 text-center"
          aria-live="polite"
        >
          <p className="text-sm text-muted-foreground">
            Estimated delivery fee
          </p>
          <p className="text-4xl font-bold tracking-tight text-primary tabular-nums">
            {fee === null ? "—" : formatCurrency(fee)}
          </p>
          {fee === null && (
            <p className="mt-1 text-xs text-destructive">
              Enter a weight between 0.1 and 1000 kg.
            </p>
          )}
        </div>

        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Base fee</dt>
            <dd className="font-medium">
              {formatCurrency(pricingConfig.baseFee)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Per kg</dt>
            <dd className="font-medium">
              {formatCurrency(pricingConfig.perKgFee)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Per km</dt>
            <dd className="font-medium">
              {formatCurrency(pricingConfig.perKmFee)}
            </dd>
          </div>
        </dl>

        <LinkButton
          href="/dashboard/shipments/new"
          size="lg"
          className="h-10 w-full"
        >
          Book this delivery
        </LinkButton>
      </CardContent>
    </Card>
  );
}
