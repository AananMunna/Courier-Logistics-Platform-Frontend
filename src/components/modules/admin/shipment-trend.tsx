"use client";

import { format, startOfDay, subDays } from "date-fns";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useShipmentList } from "@/hooks";

const RANGES = [
  ["7", "7 days"],
  ["14", "14 days"],
  ["30", "30 days"],
] as const;

type Range = (typeof RANGES)[number][0];

/**
 * Shipments booked per day. No analytics time-series endpoint exists, so this is derived
 * from the latest 100 shipments; on a very busy day range the oldest days can be undercounted.
 */
export function ShipmentTrend() {
  const [range, setRange] = useState<Range>("14");
  const { data, isPending } = useShipmentList("admin", {
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { points, total, truncated } = useMemo(() => {
    const days = Number(range);
    const today = startOfDay(new Date());
    const buckets = Array.from({ length: days }, (_, i) => {
      const day = subDays(today, days - 1 - i);
      return { key: format(day, "yyyy-MM-dd"), label: format(day, "d MMM"), count: 0 };
    });
    const index = new Map(buckets.map((b) => [b.key, b]));
    const shipments = data?.data ?? [];
    for (const s of shipments) {
      const bucket = index.get(format(new Date(s.createdAt), "yyyy-MM-dd"));
      if (bucket) {
        bucket.count += 1;
      }
    }
    const oldest = shipments.at(-1);
    return {
      points: buckets,
      total: buckets.reduce((sum, b) => sum + b.count, 0),
      // If the 100th-newest shipment is still inside the window, older ones were cut off.
      truncated:
        shipments.length >= 100 &&
        !!oldest &&
        new Date(oldest.createdAt) >= new Date(buckets[0].key),
    };
  }, [data, range]);

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold tracking-tight">
            Shipments per day
          </CardTitle>
          <CardDescription>
            {isPending ? "Loading…" : `${total} booked in the last ${range} days`}
          </CardDescription>
        </div>
        <FilterTabs
          label="Date range"
          value={range}
          onChange={setRange}
          options={RANGES}
        />
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-60 rounded-xl" />
        ) : (
          <div
            className="h-60 w-full"
            role="img"
            aria-label={`Area chart of shipments booked per day, last ${range} days`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points} margin={{ left: -16, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  minTickGap={24}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [String(value), "Shipments"]}
                  contentStyle={{
                    background: "var(--popover)",
                    color: "var(--popover-foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#trendFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        {truncated && (
          <p className="mt-2 text-xs text-muted-foreground">
            Based on the latest 100 shipments, so older days may look lower than they were.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
