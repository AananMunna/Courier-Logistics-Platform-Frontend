import { NextResponse } from "next/server";
import z from "zod";
import { getProviderConfig } from "@/lib/assistant/config";
import { runAssistant } from "@/lib/assistant/providers";

export const runtime = "nodejs";
export const maxDuration = 30;

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
 * This endpoint is public and each call uses model quota, so cap how often one IP can use it.
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

export async function POST(request: Request) {
  const provider = getProviderConfig();
  if (!provider) {
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

  try {
    const reply = await runAssistant(provider, parsed.data.messages);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { message: "The assistant is unavailable right now. Please try again." },
      { status: 502 },
    );
  }
}
