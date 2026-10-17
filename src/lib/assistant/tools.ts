import z from "zod";
import { estimateDeliveryFee } from "@/config/pricing";
import { SHIPMENT_STATUS } from "@/constants";
import type { PublicTrackingResult } from "@/types";

const BACKEND_URL = (
  process.env.BACKEND_URL ?? "http://localhost:5000"
).replace(/\/$/, "");

/** Provider-neutral tool definitions (JSON Schema, lowercase types). */
export const TOOL_DEFINITIONS = [
  {
    name: "track_parcel",
    description:
      "Look up the current status and timeline of a parcel by its tracking code.",
    parameters: {
      type: "object",
      properties: {
        tracking_code: {
          type: "string",
          description:
            "The tracking code the user gave, e.g. from their booking.",
        },
      },
      required: ["tracking_code"],
    },
  },
  {
    name: "estimate_fee",
    description:
      "Calculate the delivery fee in BDT from the parcel weight and optional distance.",
    parameters: {
      type: "object",
      properties: {
        weight_kg: {
          type: "number",
          description: "Parcel weight in kilograms.",
        },
        distance_km: {
          type: "number",
          description: "Distance in kilometres, if the user knows it.",
        },
      },
      required: ["weight_kg"],
    },
  },
] as const;

const trackInput = z.object({
  tracking_code: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-]{4,40}$/),
});
const feeInput = z.object({
  weight_kg: z.number().positive().max(1000),
  distance_km: z.number().positive().max(5000).optional(),
});

async function trackParcel(input: unknown) {
  const parsed = trackInput.safeParse(input);
  if (!parsed.success) {
    return { error: "That does not look like a valid tracking code." };
  }
  const code = parsed.data.tracking_code.toUpperCase();
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/shipments/track/${encodeURIComponent(code)}`,
      { signal: AbortSignal.timeout(8000), cache: "no-store" },
    );
    if (response.status === 404) {
      return { error: "No parcel was found with that tracking code." };
    }
    if (!response.ok) {
      return { error: "Tracking is unavailable right now." };
    }
    const { data } = (await response.json()) as { data: PublicTrackingResult };
    // Addresses are deliberately left out: the assistant never needs to repeat them.
    return {
      trackingCode: data.trackingCode,
      status: SHIPMENT_STATUS[data.status]?.label ?? data.status,
      statusMeaning: SHIPMENT_STATUS[data.status]?.description,
      from: `${data.originHub.name} (${data.originHub.zone})`,
      to: `${data.destinationHub.name} (${data.destinationHub.zone})`,
      bookedAt: data.createdAt,
      deliveredAt: data.deliveredAt ?? null,
      timeline: data.trackingEvents.slice(0, 6).map((event) => ({
        status: SHIPMENT_STATUS[event.status]?.label ?? event.status,
        at: event.createdAt,
        note: event.note ? event.note.slice(0, 200) : null,
      })),
    };
  } catch {
    return { error: "Tracking is unavailable right now." };
  }
}

export async function runTool(name: string, input: unknown) {
  if (name === "track_parcel") {
    return trackParcel(input);
  }
  if (name === "estimate_fee") {
    const parsed = feeInput.safeParse(input);
    if (!parsed.success) {
      return { error: "Weight must be a positive number of kilograms." };
    }
    return {
      currency: "BDT",
      fee: estimateDeliveryFee(parsed.data.weight_kg, parsed.data.distance_km),
    };
  }
  return { error: "Unknown tool." };
}
