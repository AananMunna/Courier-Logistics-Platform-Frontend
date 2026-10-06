"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllRiders, useShipmentList } from "@/hooks";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/utils";

interface QueueRow {
  id: string;
  title: string;
  meta: string;
  href: string;
}

function Queue({
  title,
  count,
  rows,
  href,
  pending,
  tone,
  emptyText,
}: {
  title: string;
  count: number;
  rows: QueueRow[];
  href: string;
  pending: boolean;
  tone: "warning" | "info" | "danger";
  emptyText: string;
}) {
  const badge = {
    warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    info: "bg-primary/10 text-primary",
    danger: "bg-destructive/10 text-destructive",
  }[tone];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="text-base font-semibold tracking-tight">
          {title}
        </CardTitle>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums",
            count > 0 ? badge : "bg-muted text-muted-foreground",
          )}
        >
          {pending ? "…" : count}
        </span>
      </CardHeader>
      <CardContent className="space-y-1">
        {pending ? (
          <div className="space-y-2" aria-busy="true">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        ) : rows.length === 0 ? (
          <p className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <CheckCircle2
              className="size-4 text-emerald-500"
              aria-hidden="true"
            />
            {emptyText}
          </p>
        ) : (
          <ul>
            {rows.map((row) => (
              <li key={row.id}>
                <Link
                  href={row.href}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted"
                >
                  <span className="min-w-0 truncate text-sm font-medium">
                    {row.title}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {row.meta}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {count > rows.length && (
          <Link
            href={href}
            className="flex items-center gap-1 px-2 pt-2 text-sm font-medium text-primary hover:underline"
          >
            View all {count} <ArrowRight className="size-3.5" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

/** What needs an admin right now: unassigned parcels, rider applications, failed deliveries. */
export function OpsQueue() {
  const pendingShipments = useShipmentList("admin", {
    status: "PENDING",
    page: 1,
    limit: 4,
    sortBy: "createdAt",
    sortOrder: "asc",
  });
  const failedShipments = useShipmentList("admin", {
    status: "FAILED",
    page: 1,
    limit: 4,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const applications = useGetAllRiders({
    verificationStatus: "PENDING",
    page: 1,
    limit: 4,
  });

  const toShipmentRows = (list?: typeof pendingShipments.data): QueueRow[] =>
    (list?.data ?? []).map((s) => ({
      id: s.id,
      title: s.trackingCode,
      meta: formatTimeAgo(s.createdAt),
      href: `/admin/shipments/${s.id}`,
    }));

  return (
    <section
      aria-label="Needs attention"
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <Queue
        title="Needs a rider"
        tone="info"
        count={pendingShipments.data?.meta?.total ?? 0}
        rows={toShipmentRows(pendingShipments.data)}
        href="/admin/shipments?status=PENDING"
        pending={pendingShipments.isPending}
        emptyText="Every parcel has a rider."
      />
      <Queue
        title="Rider applications"
        tone="warning"
        count={applications.data?.meta?.total ?? 0}
        rows={(applications.data?.data ?? []).map((r) => ({
          id: r.id,
          title: r.name,
          meta: formatTimeAgo(r.createdAt),
          href: "/admin/approve-rider",
        }))}
        href="/admin/approve-rider"
        pending={applications.isPending}
        emptyText="No applications waiting."
      />
      <Queue
        title="Failed deliveries"
        tone="danger"
        count={failedShipments.data?.meta?.total ?? 0}
        rows={toShipmentRows(failedShipments.data)}
        href="/admin/shipments?status=FAILED"
        pending={failedShipments.isPending}
        emptyText="No failed deliveries."
      />
    </section>
  );
}
