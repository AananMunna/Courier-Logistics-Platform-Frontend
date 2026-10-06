import type { Metadata } from "next";
import { Suspense } from "react";
import PublicTracking from "@/components/modules/tracking/public-tracking";
import { Skeleton } from "@/components/ui/skeleton";
import TrackSearchClient from "./track-search";

export const metadata: Metadata = {
  title: "Track your parcel",
  description:
    "Enter your tracking code to see where your parcel is right now. No login needed.",
  openGraph: {
    title: "Track your parcel",
    description: "Live parcel tracking — no login needed.",
  },
};

export default function TrackPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 md:py-20">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
          Track your parcel
        </h1>
        <p className="text-muted-foreground">
          No login needed — just enter your tracking code.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <TrackSearchClient />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
        <PublicTracking />
      </Suspense>
    </section>
  );
}
