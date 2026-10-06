"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminStats } from "@/types";
import { formatCurrency } from "@/utils";

const STATUS_COLORS = {
  Delivered: "#10b981",
  "In transit": "#8b5cf6",
  Pending: "#f59e0b",
  Failed: "#ef4444",
  Cancelled: "#94a3b8",
};

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  boxShadow: "0 12px 30px -18px rgb(15 23 42 / 0.4)",
  fontSize: 12,
};

const REVENUE_COLORS = ["var(--chart-2)", "#f59e0b", "#10b981"];

export function OverviewCharts({ stats }: { stats: AdminStats }) {
  const statusData = [
    { name: "Delivered", value: stats.totalDeliveredShipments },
    { name: "In transit", value: stats.totalInTransitShipments },
    { name: "Pending", value: stats.totalPendingShipments },
    { name: "Failed", value: stats.totalFailedShipments },
    { name: "Cancelled", value: stats.totalCancelledShipments },
  ].filter((item) => item.value > 0);

  const totalShipments = statusData.reduce((sum, item) => sum + item.value, 0);

  const revenueData = [
    { name: "Revenue", amount: stats.totalRevenue },
    { name: "Refunded", amount: stats.totalRefunded },
    { name: "Net", amount: stats.netRevenue },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold tracking-tight">
            Shipments by status
          </CardTitle>
          <CardDescription>Where every parcel is right now.</CardDescription>
        </CardHeader>
        <CardContent>
          {statusData.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No shipments yet.
            </p>
          ) : (
            <>
              <div
                className="relative h-56 w-full"
                role="img"
                aria-label="Pie chart of shipments by status"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={88}
                      paddingAngle={3}
                      cornerRadius={6}
                      stroke="none"
                    >
                      {statusData.map((item) => (
                        <Cell
                          key={item.name}
                          fill={
                            STATUS_COLORS[
                              item.name as keyof typeof STATUS_COLORS
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold tracking-tight tabular-nums">
                    {totalShipments}
                  </span>
                  <span className="text-xs text-muted-foreground">Shipments</span>
                </div>
              </div>
              <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                {statusData.map((item) => (
                  <li key={item.name} className="flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{
                        background:
                          STATUS_COLORS[
                            item.name as keyof typeof STATUS_COLORS
                          ],
                      }}
                    />
                    {item.name} ({item.value})
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold tracking-tight">
            Revenue
          </CardTitle>
          <CardDescription>Collected, refunded and net (৳).</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="h-64 w-full"
            role="img"
            aria-label="Bar chart of revenue, refunds and net revenue"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ left: -10, right: 8, top: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value) => formatCurrency(Number(value))}
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={56}>
                  {revenueData.map((item, index) => (
                    <Cell key={item.name} fill={REVENUE_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
