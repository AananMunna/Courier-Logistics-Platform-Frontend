"use client";

import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_LENGTH = 500;
const SUGGESTIONS = [
  "Track my parcel",
  "How is the delivery fee calculated?",
  "Can I cancel a booking?",
  "How do I become a rider?",
];

const GREETING =
  "Hi! I can help with booking, delivery fees, payments, tracking and hubs. Ask me anything, or send a tracking code and I will check it.";

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll whenever the conversation changes
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, pending, open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (text: string, history: ChatMessage[] = messages) => {
    const content = text.trim();
    if (!content || pending) {
      return;
    }
    if (content.length > MAX_LENGTH) {
      setError(`Please keep your message under ${MAX_LENGTH} characters.`);
      return;
    }

    const next = [...history, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        reply?: string;
        message?: string;
      };
      if (!response.ok || !data.reply) {
        throw new Error(
          data.message ?? "Something went wrong. Please try again.",
        );
      }
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message
          ? caught.message
          : "Unable to reach the assistant. Check your connection and try again.",
      );
    } finally {
      setPending(false);
    }
  };

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const failedLast =
    error && messages.at(-1)?.role === "user" ? messages.at(-1) : undefined;

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="CourierGo assistant"
          className="fixed right-4 bottom-20 z-50 flex max-h-[min(34rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-card text-card-foreground shadow-2xl ring-1 ring-foreground/10 sm:w-96"
        >
          <header className="flex items-center justify-between gap-2 bg-ink px-4 py-3 text-ink-foreground">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">CourierGo assistant</p>
                <p className="text-xs text-ink-foreground/70">
                  AI-generated answers
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close assistant"
              className="text-ink-foreground hover:bg-white/10 hover:text-ink-foreground"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
          </header>

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto p-4"
          >
            <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm">
              {GREETING}
            </p>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message, index) => (
              <p
                key={index}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap",
                  message.role === "user"
                    ? "ml-auto rounded-tr-sm bg-primary text-primary-foreground"
                    : "rounded-tl-sm bg-muted",
                )}
              >
                {message.content}
              </p>
            ))}

            {pending && (
              <p className="flex w-fit items-center gap-2 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
                <Spinner /> Thinking…
              </p>
            )}

            {error && (
              <div
                role="alert"
                className="space-y-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
              >
                <p>{error}</p>
                {failedLast && lastUser && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      send(lastUser.content, messages.slice(0, -1))
                    }
                  >
                    Try again
                  </Button>
                )}
              </div>
            )}
          </div>

          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="border-t p-3"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                maxLength={MAX_LENGTH}
                aria-label="Message"
                placeholder="Ask a question or paste a tracking code"
                disabled={pending}
                className="h-10 min-w-0 flex-1 rounded-xl border bg-background px-3 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60 md:text-sm"
              />
              <Button
                type="submit"
                size="icon-lg"
                aria-label="Send message"
                disabled={pending || !input.trim()}
              >
                {pending ? <Spinner /> : <Send />}
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              AI can make mistakes. For account issues, contact support.
            </p>
          </form>
        </section>
      )}

      <Button
        type="button"
        size="icon-lg"
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="fixed right-4 bottom-4 z-50 size-12 rounded-full shadow-[0_10px_30px_-8px_var(--primary)]"
      >
        {open ? <X /> : <MessageCircle />}
      </Button>
    </>
  );
}
