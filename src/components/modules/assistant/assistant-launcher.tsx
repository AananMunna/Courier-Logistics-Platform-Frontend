import { getProviderConfig, PROVIDER_NOTICE } from "@/lib/assistant/config";
import AssistantWidget from "./assistant-widget";

/**
 * Shows the assistant only when the server has a model API key
 * (GEMINI_API_KEY or ANTHROPIC_API_KEY), so a deployment without one never
 * displays a chat button that cannot answer.
 */
export default function AssistantLauncher() {
  const provider = getProviderConfig();
  if (!provider) {
    return null;
  }
  return <AssistantWidget notice={PROVIDER_NOTICE[provider.name]} />;
}
