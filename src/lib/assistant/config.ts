export type AssistantProvider = "gemini" | "anthropic";

export interface ProviderConfig {
  name: AssistantProvider;
  apiKey: string;
}

/**
 * Picks the model provider from the environment.
 * - ASSISTANT_PROVIDER=gemini|anthropic forces one (its key must be set).
 * - Otherwise Gemini is used when GEMINI_API_KEY is set (it has a free tier),
 *   then Anthropic when ANTHROPIC_API_KEY is set.
 * Returns null when no key is configured, which hides the assistant.
 */
export function getProviderConfig(): ProviderConfig | null {
  const gemini = process.env.GEMINI_API_KEY;
  const anthropic = process.env.ANTHROPIC_API_KEY;
  const forced = process.env.ASSISTANT_PROVIDER;

  if (forced === "anthropic") {
    return anthropic ? { name: "anthropic", apiKey: anthropic } : null;
  }
  if (forced === "gemini") {
    return gemini ? { name: "gemini", apiKey: gemini } : null;
  }
  if (gemini) {
    return { name: "gemini", apiKey: gemini };
  }
  if (anthropic) {
    return { name: "anthropic", apiKey: anthropic };
  }
  return null;
}

/** Shown in the chat window so visitors know where their messages go. */
export const PROVIDER_NOTICE: Record<AssistantProvider, string> = {
  gemini:
    "Powered by Google Gemini's free tier. Messages may be used by Google to improve its products, so do not share personal details.",
  anthropic: "AI can make mistakes. For account issues, contact support.",
};
