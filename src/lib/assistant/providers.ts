import type { ProviderConfig } from "./config";
import { buildSystemPrompt } from "./knowledge";
import { runTool, TOOL_DEFINITIONS } from "./tools";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export class ProviderError extends Error {}

const MAX_TOOL_ROUNDS = 4;
const REQUEST_TIMEOUT_MS = 20000;

export const EMPTY_REPLY =
  "Sorry, I could not come up with an answer. Please try again.";
export const TOO_MANY_STEPS_REPLY =
  "That took too many steps. Please ask again in a simpler way.";

/* ---------------- Anthropic (Claude) ---------------- */

/** Override only to route through a gateway or a test double. */
const ANTHROPIC_URL =
  process.env.ANTHROPIC_API_URL ?? "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = process.env.ASSISTANT_MODEL ?? "claude-haiku-5-5";

type AnthropicText = { type: "text"; text: string };
type AnthropicToolUse = {
  type: "tool_use";
  id: string;
  name: string;
  input: unknown;
};
type AnthropicBlock = AnthropicText | AnthropicToolUse;
type AnthropicMessage = {
  role: "user" | "assistant";
  content: string | unknown[];
};

async function callAnthropic(apiKey: string, messages: AnthropicMessage[]) {
  const response = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 600,
      system: buildSystemPrompt(),
      tools: TOOL_DEFINITIONS.map(({ name, description, parameters }) => ({
        name,
        description,
        input_schema: parameters,
      })),
      messages,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    console.error("[assistant] anthropic request failed", response.status);
    throw new ProviderError("model_error");
  }
  return (await response.json()) as {
    stop_reason: string;
    content: AnthropicBlock[];
  };
}

async function runAnthropic(apiKey: string, history: ChatMessage[]) {
  const messages: AnthropicMessage[] = [...history];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const result = await callAnthropic(apiKey, messages);

    if (result.stop_reason !== "tool_use") {
      return result.content
        .filter((block): block is AnthropicText => block.type === "text")
        .map((block) => block.text)
        .join("\n")
        .trim();
    }

    const toolCalls = result.content.filter(
      (block): block is AnthropicToolUse => block.type === "tool_use",
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
  return null;
}

/* ---------------- Google Gemini (Interactions API) ---------------- */

const GEMINI_URL =
  process.env.GEMINI_API_URL ??
  "https://generativelanguage.googleapis.com/v1beta/interactions";
// Free-tier model. Other free options: gemini-3.8-flash, gemini-3.1-flash-lite.
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite";

type GeminiStep = { type: string; [key: string]: unknown };
type GeminiFunctionCall = GeminiStep & {
  type: "function_call";
  id: string;
  name: string;
  arguments: unknown;
};

async function callGemini(apiKey: string, input: GeminiStep[]) {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      system_instruction: buildSystemPrompt(),
      input,
      // Stateless: we resend the history ourselves, so nothing is stored on Google's side by id.
      store: false,
      tools: TOOL_DEFINITIONS.map(({ name, description, parameters }) => ({
        type: "function",
        name,
        description,
        parameters,
      })),
      // Thinking tokens can count toward this limit, so keep it generous.
      generation_config: { max_output_tokens: 1024 },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    console.error("[assistant] gemini request failed", response.status);
    throw new ProviderError("model_error");
  }
  return (await response.json()) as { steps?: GeminiStep[] };
}

async function runGemini(apiKey: string, history: ChatMessage[]) {
  const input: GeminiStep[] = history.map((message) => ({
    type: message.role === "user" ? "user_input" : "model_output",
    content: [{ type: "text", text: message.content }],
  }));

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const result = await callGemini(apiKey, input);
    const steps = result.steps ?? [];
    const calls = steps.filter(
      (step): step is GeminiFunctionCall => step.type === "function_call",
    );

    if (calls.length === 0) {
      return steps
        .filter((step) => step.type === "model_output")
        .flatMap((step) =>
          Array.isArray(step.content)
            ? (step.content as { type?: string; text?: string }[])
            : [],
        )
        .filter((part) => part.type === "text" && part.text)
        .map((part) => part.text)
        .join("\n")
        .trim();
    }

    // Resend the model's steps unchanged, then answer each call.
    input.push(...steps);
    for (const call of calls) {
      input.push({
        type: "function_result",
        name: call.name,
        call_id: call.id,
        result: [
          {
            type: "text",
            text: JSON.stringify(await runTool(call.name, call.arguments)),
          },
        ],
      });
    }
  }
  return null;
}

/* ---------------- entry point ---------------- */

export async function runAssistant(
  provider: ProviderConfig,
  history: ChatMessage[],
) {
  const reply =
    provider.name === "gemini"
      ? await runGemini(provider.apiKey, history)
      : await runAnthropic(provider.apiKey, history);

  if (reply === null) {
    return TOO_MANY_STEPS_REPLY;
  }
  return reply || EMPTY_REPLY;
}
