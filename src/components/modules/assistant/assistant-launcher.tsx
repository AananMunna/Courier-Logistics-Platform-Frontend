import AssistantWidget from "./assistant-widget";

/**
 * Shows the assistant only when the server has an ANTHROPIC_API_KEY, so a deployment
 * without the key never displays a chat button that cannot answer.
 */
export default function AssistantLauncher() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }
  return <AssistantWidget />;
}
