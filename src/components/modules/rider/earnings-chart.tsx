"use client";

import { format, startOfDay, subDays } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RiderEarnings } from "@/types";
import { formatCurrency, toNumber } from "@/utils";

const DAYS = 7;

/** Last 7 days of commission, derived from the recent deliveries the API returns. */
export function EarningsChart({ earnings }: { earnings: RiderEarnings }) {
  const today = startOfDay(new Date());
  const buckets = Array.from({ length: DAYS }, (_, i) => {
    const day = subDays(today, DAYS - 1 - i);
    return { key: format(day, "yyyy-MM-dd"), label: format(day, "EEE"), amount: 0 };
  });
  const index = new Map(buckets.map((b) => [b.key, b]));

  for (const delivery of earnings.recentDeliveries) {
    if (!delivery.deliveredAt) {
      continue;
    }
    const bucket = index.get(format(new Date(delivery.deliveredAt), "yyyy-MM-dd"));
    if (bucket) {
      bucket.amount += toNumber(delivery.deliveryFee) * earnings.commissionRate;
    }
  }

  const weekTotal = buckets.reduce((sum, b) => sum + b.amount, 0);
  const todayTotal = buckets[DAYS - 1].amount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold tracking-tight">
          Last 7 days
        </CardTitle>
        <dl className="grid grid-cols-3 gap-3 pt-2 text-sm">
          <Summary label="Today" value={formatCurrency(todayTotal)} />
          <Summary label="This week" value={formatCurrency(weekTotal)} />
          <Summary label="All time" value={formatCurrency(earnings.totalEarnings)} />
        </dl>
      </CardHeader>
      <CardContent>
        <div className="h-52 w-full" role="img" aria-label="Earnings per day, last 7 days">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={buckets} margin={{ left: -16, right: 4, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                formatter={(value) => [formatCurrency(Number(value)), "Earned"]}
                contentStyle={{
                  background: "var(--popover)",
                  color: "var(--popover-foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="amount" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Based on your most recent deliveries.
        </p>
      </CardContent>
    </Card>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
