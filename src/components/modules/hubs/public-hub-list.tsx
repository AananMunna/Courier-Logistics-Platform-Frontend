"use client";

import { subDays } from "date-fns";
import { FilterX, SearchX } from "lucide-react";
import { useId, useMemo } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import TablePagination from "@/components/ui/table-pagination";
import { useActiveHubs, useUrlState } from "@/hooks";
import type { Hub } from "@/types";
import { HubCard, HubCardSkeleton } from "./hub-card";

const PAGE_SIZE = 8; // two rows of four on desktop

const SORTS = [
  ["name-asc", "Name A–Z"],
  ["name-desc", "Name Z–A"],
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
] as const;
type SortKey = (typeof SORTS)[number][0];

const CONTACT_OPTIONS = [
  ["ALL", "Any"],
  ["YES", "Has a phone number"],
] as const;

const ADDED_OPTIONS = [
  ["ALL", "Any time"],
  ["30", "Last 30 days"],
  ["365", "Last year"],
] as const;

function sortHubs(hubs: Hub[], sort: SortKey) {
  const copy = [...hubs];
  switch (sort) {
    case "name-desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case "newest":
      return copy.sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
      );
    case "oldest":
      return copy.sort(
        (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
      );
    default:
      return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly (readonly [string, string])[];
}) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <NativeSelect
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}

function HubGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: PAGE_SIZE }, (_, index) => (
        <HubCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default function PublicHubList() {
  const { getString, getNumber, setParams, reset, searchParams } =
    useUrlState();
  const zone = getString("zone", "ALL");
  const contact = getString("contact", "ALL");
  const added = getString("added", "ALL");
  const search = getString("search");
  const rawSort = getString("sort", "name-asc");
  const sort: SortKey = SORTS.some(([key]) => key === rawSort)
    ? (rawSort as SortKey)
    : "name-asc";
  const page = getNumber("page", 1);

  const { data, isPending, error, refetch } = useActiveHubs();
  const hubs = useMemo(() => data?.data ?? [], [data]);

  const zones = useMemo(
    () => Array.from(new Set(hubs.map((hub) => hub.zone))).sort(),
    [hubs],
  );

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    const cutoff = added === "ALL" ? null : subDays(new Date(), Number(added));
    const matches = hubs.filter(
      (hub) =>
        (zone === "ALL" || hub.zone === zone) &&
        (contact === "ALL" || Boolean(hub.contactNumber)) &&
        (!cutoff || new Date(hub.createdAt) >= cutoff) &&
        (!term ||
          hub.name.toLowerCase().includes(term) ||
          hub.address.toLowerCase().includes(term) ||
          hub.zone.toLowerCase().includes(term)),
    );
    return sortHubs(matches, sort);
  }, [hubs, zone, contact, added, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const hasFilters = ["zone", "contact", "added", "search", "sort"].some(
    (key) => searchParams.has(key),
  );

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/[0.07]">
        <SearchInput
          value={search}
          onSearch={(value) => setParams({ search: value })}
          placeholder="Search by hub, area or address"
          label="Search hubs"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FilterSelect
            label="Zone"
            value={zone}
            onChange={(value) =>
              setParams({ zone: value === "ALL" ? null : value })
            }
            options={[
              ["ALL", "All zones"],
              ...zones.map((name) => [name, name] as const),
            ]}
          />
          <FilterSelect
            label="Contact"
            value={contact}
            onChange={(value) =>
              setParams({ contact: value === "ALL" ? null : value })
            }
            options={CONTACT_OPTIONS}
          />
          <FilterSelect
            label="Added"
            value={added}
            onChange={(value) =>
              setParams({ added: value === "ALL" ? null : value })
            }
            options={ADDED_OPTIONS}
          />
          <FilterSelect
            label="Sort by"
            value={sort}
            onChange={(value) =>
              setParams({ sort: value === "name-asc" ? null : value })
            }
            options={SORTS}
          />
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!hasFilters}
              onClick={reset}
            >
              <FilterX /> Clear filters
            </Button>
          </div>
        </div>
      </div>

      {isPending ? (
        <HubGridSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No hubs match your filters"
          description="Try a different area or clear the filters."
          action={
            hasFilters ? (
              <Button type="button" variant="outline" onClick={reset}>
                <FilterX /> Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {start + 1}–{start + visible.length} of {filtered.length}{" "}
            {filtered.length === 1 ? "hub" : "hubs"}
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((hub) => (
              <li key={hub.id}>
                <HubCard hub={hub} />
              </li>
            ))}
          </ul>
          <TablePagination
            page={currentPage}
            totalPages={totalPages}
            handlePageChange={(next) => setParams({ page: next })}
          />
        </>
      )}
    </div>
  );
}
