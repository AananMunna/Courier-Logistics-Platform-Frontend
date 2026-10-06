"use client";

import { useSearchParams } from "next/navigation";
import TrackForm from "@/components/modules/tracking/track-form";

/** Keyed by code so the input resets when the URL changes. */
export default function TrackSearchClient() {
  const code = useSearchParams().get("code") ?? "";
  return (
    <TrackForm key={code} defaultValue={code} className="mx-auto max-w-xl" />
  );
}
