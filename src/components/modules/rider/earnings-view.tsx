"use client";

import { Banknote, PackageCheck, Percent, Star } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { StatCard, StatGridSkeleton } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyEarnings } from "@/hooks";
import { formatCurrency, formatDateTime, toNumber } from "@/utils";
import { EarningsChart } from "./earnings-chart";

export default function EarningsView() {
  const { data, isPending, error, refetch } = useMyEarnings();

  if (isPending) {
    return (
      <div className="space-y-6">
        <StatGridSkeleton />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const earnings = data.data;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total earnings"
          value={formatCurrency(earnings.totalEarnings)}
          icon={Banknote}
          tone="success"
        />
        <StatCard
          label="Deliveries"
          value={earnings.totalDeliveredShipments}
          icon={PackageCheck}
        />
        <StatCard
          label="Fees collected"
          value={formatCurrency(earnings.totalDeliveryFeeCollected)}
          icon={Banknote}
          tone="info"
        />
        <StatCard
          label="Your commission"
          value={`${Math.round(earnings.commissionRate * 100)}%`}
          icon={Percent}
          hint={`Rating ${toNumber(earnings.rating).toFixed(1)}`}
        />
      </div>

      <EarningsChart earnings={earnings} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="size-4 text-amber-500" aria-hidden="true" /> Recent
            deliveries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earnings.recentDeliveries.length === 0 ? (
            <EmptyState
              title="No deliveries yet"
              description="Completed deliveries and what you earned from them will show up here."
            />
          ) : (
            <ul className="divide-y">
              {earnings.recentDeliveries.map((delivery) => (
                <li
                  key={delivery.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <Link
                      href={`/rider/shipments/${delivery.id}`}
                      className="font-mono text-sm font-medium text-primary hover:underline"
                    >
                      {delivery.trackingCode}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(delivery.deliveredAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold tabular-nums">
                      +
                      {formatCurrency(
                        toNumber(delivery.deliveryFee) *
                          earnings.commissionRate,
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      of {formatCurrency(delivery.deliveryFee)} fee
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
