"use client";

import { ArrowRight, PackageOpen } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { CardListSkeleton } from "@/components/shared/table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import type { ShipmentListScope } from "@/hooks";
import { useShipmentList } from "@/hooks";
import ShipmentList from "../shipments/shipment-list";

interface Props {
  role: ShipmentListScope;
  title?: string;
  emptyText: string;
  viewAllHref: string;
  emptyAction?: React.ReactNode;
  limit?: number;
}

export function RecentShipments({
  role,
  title = "Recent shipments",
  emptyText,
  viewAllHref,
  emptyAction,
  limit = 5,
}: Props) {
  const { data, isPending, error, refetch } = useShipmentList(role, {
    page: 1,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const shipments = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold tracking-tight">
          {title}
        </CardTitle>
        <LinkButton
          href={viewAllHref}
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary"
        >
          View all <ArrowRight />
        </LinkButton>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <CardListSkeleton rows={3} />
        ) : error ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : shipments.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title="Nothing here yet"
            description={emptyText}
            action={emptyAction}
          />
        ) : (
          <ShipmentList shipments={shipments} role={role} />
        )}
      </CardContent>
    </Card>
  );
}

export function ViewAllLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-primary hover:underline"
    >
      {children}
    </Link>
  );
}
