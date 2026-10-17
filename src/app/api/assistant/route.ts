import { NextResponse } from "next/server";
import z from "zod";
import { estimateDeliveryFee } from "@/config/pricing";
import { SHIPMENT_STATUS } from "@/constants";
import { buildSystemPrompt } from "@/lib/assistant/knowledge";
import type { PublicTrackingResult } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = process.env.ASSISTANT_MODEL ?? "claude-haiku-5-5";
/** Override only to route through a gateway or a test double. */
const API_URL =
  process.env.ANTHROPIC_API_URL ?? "https://api.anthropic.com/v1/messages";
const MAX_TOOL_ROUNDS = 4;
const BACKEND_URL = (
  process.env.BACKEND_URL ?? "http://localhost:5000"
).replace(/\/$/, "");

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(500),
      }),
    )
    .min(1)
    .max(12),
});

/* ---------- basic abuse protection ----------
 * This endpoint is public and each call costs money, so cap how often one IP can use it.
 * The map lives in memory, which is per serverless instance: it slows abuse down but is not
 * a hard guarantee. For a strict limit use a shared store (Redis/Upstash) instead.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [key, value] of hits) {
      if (value.resetAt < now) {
        hits.delete(key);
      }
    }
  }
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

/* ---------- tools ---------- */
const TOOLS = [
  {
    name: "track_parcel",
    description:
      "Look up the current status and timeline of a parcel by its tracking code.",
    input_schema: {
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
    input_schema: {
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
];

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

async function runTool(name: string, input: unknown) {
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

/* ---------- model call ---------- */
type TextBlock = { type: "text"; text: string };
type ToolUseBlock = {
  type: "tool_use";
  id: string;
  name: string;
  input: unknown;
};
type ContentBlock = TextBlock | ToolUseBlock;
type ApiMessage = {
  role: "user" | "assistant";
  content: string | unknown[];
};

async function callModel(apiKey: string, messages: ApiMessage[]) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      system: buildSystemPrompt(),
      tools: TOOLS,
      messages,
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    console.error("[assistant] model request failed", response.status);
    throw new Error("model_error");
  }
  return (await response.json()) as {
    stop_reason: string;
    content: ContentBlock[];
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "The assistant is not configured." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        message:
          "You are sending messages too quickly. Please wait a few minutes.",
      },
      { status: 429 },
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== "user") {
    return NextResponse.json(
      { message: "Send a message of up to 500 characters." },
      { status: 400 },
    );
  }

  const messages: ApiMessage[] = parsed.data.messages;

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      const result = await callModel(apiKey, messages);

      if (result.stop_reason !== "tool_use") {
        const reply = result.content
          .filter((block): block is TextBlock => block.type === "text")
          .map((block) => block.text)
          .join("\n")
          .trim();
        return NextResponse.json({
          reply:
            reply ||
            "Sorry, I could not come up with an answer. Please try again.",
        });
      }

      const toolCalls = result.content.filter(
        (block): block is ToolUseBlock => block.type === "tool_use",
      );
      messages.push({ role: "assistant", content: result.content });
      messages.push({
        role: "user",
        content: await Promise.all(
          toolCalls.map(async (call) => ({
            type: "tool_result",
            tool_use_id: call.id,
            content: JSON.stringify(await runTool(call.name, call.input)),
          })),
        ),
      });
    }

    return NextResponse.json({
      reply: "That took too many steps. Please ask again in a simpler way.",
    });
  } catch {
    return NextResponse.json(
      { message: "The assistant is unavailable right now. Please try again." },
      { status: 502 },
    );
  }
}
