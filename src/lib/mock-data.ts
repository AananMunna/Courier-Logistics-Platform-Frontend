/**
 * Deterministic, representative datasets used by the admin Data Explorer to
 * demonstrate virtualization with 1,000+ rows. A seeded PRNG keeps the data
 * identical between renders, reloads and Lighthouse runs.
 */
import type { ShipmentStatus } from "@/types";

export interface ExplorerShipment {
  id: string;
  trackingCode: string;
  route: string;
  receiver: string;
  status: ShipmentStatus;
  fee: number;
  createdAt: string;
}

export interface ExplorerActivity {
  id: string;
  trackingCode: string;
  status: ShipmentStatus;
  note: string;
  actor: string;
  createdAt: string;
}

const STATUSES: ShipmentStatus[] = [
  "PENDING",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
  "CANCELLED",
];
const HUBS = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Kushtia",
  "Barishal",
  "Rangpur",
];
const NAMES = [
  "Aanan Munna",
  "Rahim Uddin",
  "Nusrat Jahan",
  "Tanvir Hasan",
  "Sadia Islam",
  "Mehedi Hasan",
  "Farhana Akter",
  "Imran Hossain",
];
const NOTES = [
  "Parcel received at hub",
  "Rider assigned",
  "Out for delivery",
  "Receiver unavailable, retry scheduled",
  "Delivered to receiver",
  "Address verified by phone",
];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(list: readonly T[], rand: () => number) =>
  list[Math.floor(rand() * list.length)] as T;

const BASE_TIME = Date.UTC(2026, 10, 1);

export function generateShipments(count = 1200): ExplorerShipment[] {
  const rand = mulberry32(7);
  return Array.from({ length: count }, (_, index) => {
    const from = pick(HUBS, rand);
    let to = pick(HUBS, rand);
    if (to === from)
      to = HUBS[(HUBS.indexOf(from) + 1) % HUBS.length] as string;
    return {
      id: `shp_${index}`,
      trackingCode: `CG-${String(100000 + index)}`,
      route: `${from} → ${to}`,
      receiver: pick(NAMES, rand),
      status: pick(STATUSES, rand),
      fee: Math.round(60 + rand() * 340),
      createdAt: new Date(BASE_TIME - index * 3_600_000).toISOString(),
    };
  });
}

export function generateActivity(count = 1500): ExplorerActivity[] {
  const rand = mulberry32(21);
  return Array.from({ length: count }, (_, index) => ({
    id: `act_${index}`,
    trackingCode: `CG-${String(100000 + Math.floor(rand() * 1200))}`,
    status: pick(STATUSES, rand),
    note: pick(NOTES, rand),
    actor: pick(NAMES, rand),
    createdAt: new Date(BASE_TIME - index * 900_000).toISOString(),
  }));
}
