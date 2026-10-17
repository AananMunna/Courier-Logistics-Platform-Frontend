import type { Metadata } from "next";
import { Suspense } from "react";
import PublicHubList from "@/components/modules/hubs/public-hub-list";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Our hubs",
  description:
    "Find a courier hub near you. Browse our active hubs by zone and see addresses and contact numbers.",
  openGraph: { title: "Our hubs", description: "Find a courier hub near you." },
};

export default function HubsPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-14 md:py-24">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
          Our hubs
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Drop-off and transfer points across the country. Pick the hubs closest
          to the pickup and the receiver when you book.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <PublicHubList />
      </Suspense>
    </section>
  );
}
