"use client";

import { Building2, MapPin, Phone, SearchX } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { SearchInput } from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllHubs, useUrlState } from "@/hooks";

function HubSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-36 rounded-2xl" />
      ))}
    </div>
  );
}

export default function PublicHubList() {
  const { getString, setParams } = useUrlState();
  const zone = getString("zone", "ALL");
  const search = getString("search");

  const { data, isPending, error, refetch } = useGetAllHubs({
    isActive: true,
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });

  const hubs = useMemo(() => data?.data ?? [], [data]);
  const zones = useMemo(
    () => Array.from(new Set(hubs.map((hub) => hub.zone))).sort(),
    [hubs],
  );

  const visible = useMemo(() => {
    const term = search.toLowerCase();
    return hubs.filter(
      (hub) =>
        (zone === "ALL" || hub.zone === zone) &&
        (!term ||
          hub.name.toLowerCase().includes(term) ||
          hub.address.toLowerCase().includes(term) ||
          hub.zone.toLowerCase().includes(term)),
    );
  }, [hubs, zone, search]);

  if (isPending) {
    return <HubSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchInput
          value={search}
          onSearch={(value) => setParams({ search: value })}
          placeholder="Search by hub, area or address"
          label="Search hubs"
        />
        <FilterTabs
          label="Filter by zone"
          value={zone}
          onChange={(value) =>
            setParams({ zone: value === "ALL" ? null : value })
          }
          options={[
            ["ALL", "All zones"],
            ...zones.map((name) => [name, name] as const),
          ]}
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No hubs match your search"
          description="Try a different area or clear the filters."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((hub) => (
            <li key={hub.id}>
              <Card className="group h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-30px_rgb(15_23_42/0.35)]">
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-xl bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Building2 className="size-4" aria-hidden="true" />
                    </span>
                    <Badge variant="secondary">{hub.zone}</Badge>
                  </div>
                  <h2 className="font-semibold">{hub.name}</h2>
                  <p className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />{" "}
                    {hub.address}
                  </p>
                  {hub.contactNumber && (
                    <a
                      href={`tel:${hub.contactNumber}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="size-4 shrink-0" aria-hidden="true" />{" "}
                      {hub.contactNumber}
                    </a>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
