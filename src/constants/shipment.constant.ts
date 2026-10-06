import type { ParcelType, ShipmentStatus, VehicleType } from "@/types";

export interface StatusMeta {
  label: string;
  /** Short customer-friendly sentence shown on tracking pages. */
  description: string;
  /** Tailwind classes for badges (light + dark). */
  badgeClass: string;
  dotClass: string;
}

export const SHIPMENT_STATUS: Record<ShipmentStatus, StatusMeta> = {
  PENDING: {
    label: "Pending",
    description: "Booked. We are assigning a rider to your parcel.",
    badgeClass:
      "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
    dotClass: "bg-amber-500",
  },
  ASSIGNED: {
    label: "Rider assigned",
    description: "A rider has been assigned and will pick up your parcel.",
    badgeClass:
      "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20",
    dotClass: "bg-sky-500",
  },
  PICKED_UP: {
    label: "Picked up",
    description: "The rider has collected your parcel.",
    badgeClass:
      "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-400/20",
    dotClass: "bg-indigo-500",
  },
  IN_TRANSIT: {
    label: "In transit",
    description: "Your parcel is moving between hubs.",
    badgeClass:
      "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20",
    dotClass: "bg-violet-500",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for delivery",
    description: "The rider is on the way to the receiver.",
    badgeClass:
      "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-300 dark:ring-orange-400/20",
    dotClass: "bg-orange-500",
  },
  DELIVERED: {
    label: "Delivered",
    description: "Delivered successfully.",
    badgeClass:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    dotClass: "bg-emerald-500",
  },
  FAILED: {
    label: "Delivery failed",
    description:
      "We could not deliver the parcel. We will try again or return it.",
    badgeClass:
      "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-400/20",
    dotClass: "bg-red-500",
  },
  RETURNED: {
    label: "Returned",
    description: "The parcel is being returned to the sender.",
    badgeClass:
      "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20",
    dotClass: "bg-rose-500",
  },
  CANCELLED: {
    label: "Cancelled",
    description: "This shipment was cancelled.",
    badgeClass:
      "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/20",
    dotClass: "bg-slate-400",
  },
};

export const SHIPMENT_STATUSES = Object.keys(
  SHIPMENT_STATUS,
) as ShipmentStatus[];

/** Happy-path steps shown in the progress tracker. */
export const SHIPMENT_FLOW: ShipmentStatus[] = [
  "PENDING",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

/** Statuses that still need work from a rider. */
export const ACTIVE_STATUSES: ShipmentStatus[] = [
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
];

export const TERMINAL_STATUSES: ShipmentStatus[] = [
  "DELIVERED",
  "RETURNED",
  "CANCELLED",
];

/** Mirrors the backend STATUS_TRANSITIONS map (rider/admin actions). */
export const NEXT_STATUS_ACTIONS: Partial<
  Record<
    ShipmentStatus,
    {
      status:
        | "PICKED_UP"
        | "IN_TRANSIT"
        | "OUT_FOR_DELIVERY"
        | "DELIVERED"
        | "FAILED"
        | "RETURNED";
      label: string;
      variant: "default" | "destructive" | "outline";
    }[]
  >
> = {
  ASSIGNED: [
    { status: "PICKED_UP", label: "Mark picked up", variant: "default" },
  ],
  PICKED_UP: [
    { status: "IN_TRANSIT", label: "Start transit", variant: "default" },
    { status: "FAILED", label: "Report problem", variant: "destructive" },
  ],
  IN_TRANSIT: [
    {
      status: "OUT_FOR_DELIVERY",
      label: "Out for delivery",
      variant: "default",
    },
    { status: "FAILED", label: "Report problem", variant: "destructive" },
  ],
  OUT_FOR_DELIVERY: [
    { status: "DELIVERED", label: "Mark delivered", variant: "default" },
    { status: "FAILED", label: "Delivery failed", variant: "destructive" },
  ],
  FAILED: [{ status: "RETURNED", label: "Mark returned", variant: "outline" }],
};

export const PARCEL_TYPES: {
  value: ParcelType;
  label: string;
  hint: string;
}[] = [
  {
    value: "DOCUMENT",
    label: "Document",
    hint: "Papers, certificates, envelopes",
  },
  {
    value: "PARCEL",
    label: "General parcel",
    hint: "Clothes, books, everyday items",
  },
  {
    value: "FRAGILE",
    label: "Fragile",
    hint: "Glass, ceramics, handle with care",
  },
  {
    value: "ELECTRONICS",
    label: "Electronics",
    hint: "Phones, gadgets, accessories",
  },
  { value: "FOOD", label: "Food", hint: "Packed, non-perishable food" },
  { value: "OTHER", label: "Other", hint: "Anything else (describe it below)" },
];

export const PARCEL_TYPE_LABEL = Object.fromEntries(
  PARCEL_TYPES.map((type) => [type.value, type.label]),
) as Record<ParcelType, string>;

export const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: "BICYCLE", label: "Bicycle" },
  { value: "MOTORCYCLE", label: "Motorcycle" },
  { value: "VAN", label: "Van" },
  { value: "TRUCK", label: "Truck" },
];

export const VEHICLE_TYPE_LABEL = Object.fromEntries(
  VEHICLE_TYPES.map((type) => [type.value, type.label]),
) as Record<VehicleType, string>;
