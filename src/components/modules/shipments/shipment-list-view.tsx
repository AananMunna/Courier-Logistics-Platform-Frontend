"use client";

import { PackageOpen, PackagePlus, SearchX } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { SearchInput } from "@/components/shared/search-input";
import { CardListSkeleton } from "@/components/shared/table-skeleton";
import { LinkButton } from "@/components/ui/link-button";
import { NativeSelect } from "@/components/ui/native-select";
import TablePagination from "@/components/ui/table-pagination";
import { SHIPMENT_STATUS } from "@/constants";
import { useShipmentList, useUrlState } from "@/hooks";
import type { ShipmentParams, ShipmentStatus } from "@/types";
import ShipmentList, { type ShipmentViewRole } from "./shipment-list";

type StatusFilter = "ALL" | ShipmentStatus;

const FILTERS: Record<
  ShipmentViewRole,
  readonly (readonly [StatusFilter, string])[]
> = {
  admin: [
    ["ALL", "All"],
    ["PENDING", "Needs rider"],
    ["ASSIGNED", "Assigned"],
    ["IN_TRANSIT", "In transit"],
    ["OUT_FOR_DELIVERY", "Out for delivery"],
    ["DELIVERED", "Delivered"],
    ["FAILED", "Failed"],
    ["CANCELLED", "Cancelled"],
  ],
  customer: [
    ["ALL", "All"],
    ["PENDING", "Pending"],
    ["IN_TRANSIT", "In transit"],
    ["OUT_FOR_DELIVERY", "Out for delivery"],
    ["DELIVERED", "Delivered"],
    ["CANCELLED", "Cancelled"],
  ],
  rider: [
    ["ALL", "All"],
    ["ASSIGNED", "To pick up"],
    ["PICKED_UP", "Picked up"],
    ["IN_TRANSIT", "In transit"],
    ["OUT_FOR_DELIVERY", "Out for delivery"],
    ["DELIVERED", "Delivered"],
    ["FAILED", "Failed"],
  ],
};

const PAGE_SIZE = 10;

export default function ShipmentListView({ role }: { role: ShipmentViewRole }) {
  const { getString, getNumber, setParams } = useUrlState();

  const rawStatus = getString("status", "ALL");
  const status = (
    rawStatus in SHIPMENT_STATUS ? rawStatus : "ALL"
  ) as StatusFilter;
  const search = getString("search");
  const page = getNumber("page", 1);
  const sortOrder = getString("sort") === "asc" ? "asc" : "desc";

  const params: ShipmentParams = {
    page,
    limit: PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder,
    ...(status !== "ALL" ? { status } : {}),
    ...(search ? { searchTerm: search } : {}),
  };

  const { data, isPending, isFetching, error, refetch } = useShipmentList(
    role,
    params,
  );

  const shipments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const hasFilters = status !== "ALL" || !!search;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={search}
          onSearch={(value) => setParams({ search: value })}
          placeholder="Search tracking code or name"
          label="Search shipments"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="sr-only">
            Sort order
          </label>
          <NativeSelect
            id="sort"
            value={sortOrder}
            onChange={(event) =>
              setParams({ sort: event.target.value === "asc" ? "asc" : null })
            }
            className="w-40"
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </NativeSelect>
        </div>
      </div>

      <FilterTabs
        label="Filter by status"
        value={status}
        onChange={(value) =>
          setParams({ status: value === "ALL" ? null : value })
        }
        options={FILTERS[role]}
      />

      {isPending ? (
        <CardListSkeleton rows={5} />
      ) : error ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : shipments.length === 0 ? (
        <div className="rounded-2xl border bg-card">
          {hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="No shipments match"
              description="Try a different status or search term."
              action={
                <LinkButton variant="outline" href="?">
                  Clear filters
                </LinkButton>
              }
            />
          ) : (
            <EmptyState
              icon={PackageOpen}
              title="No shipments yet"
              description={
                role === "customer"
                  ? "Book your first parcel and it will show up here."
                  : role === "rider"
                    ? "Shipments assigned to you will appear here."
                    : "Shipments booked by customers will appear here."
              }
              action={
                role === "customer" ? (
                  <LinkButton href="/dashboard/shipments/new">
                    <PackagePlus /> New shipment
                  </LinkButton>
                ) : undefined
              }
            />
          )}
        </div>
      ) : (
        <>
          <ShipmentList
            shipments={shipments}
            role={role}
            isFetching={isFetching}
          />
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              {data?.meta?.total ?? shipments.length} shipment
              {(data?.meta?.total ?? shipments.length) === 1 ? "" : "s"}
            </p>
            <TablePagination
              page={page}
              totalPages={totalPages}
              handlePageChange={(next) => setParams({ page: next })}
            />
          </div>
        </>
      )}
    </div>
  );
}
