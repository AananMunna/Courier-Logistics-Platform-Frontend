import { differenceInCalendarDays } from "date-fns";
import type { Hub } from "@/types";

/** One-line description built only from real hub data (no filler copy). */
export function hubSummary(hub: Pick<Hub, "zone" | "address">) {
  return `Parcel drop-off and transfer point serving ${hub.zone}. Find it at ${hub.address}.`;
}

/** Stable 32-bit hash so the same hub always gets the same artwork. */
export function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function isRecentHub(hub: Pick<Hub, "createdAt">, days = 30) {
  return differenceInCalendarDays(new Date(), new Date(hub.createdAt)) <= days;
}

export function hubMapsUrl(hub: Pick<Hub, "name" | "address">) {
  const query = encodeURIComponent(`${hub.name}, ${hub.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
