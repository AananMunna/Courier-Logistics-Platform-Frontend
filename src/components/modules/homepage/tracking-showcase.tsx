"use client";

import { CheckCircle2, Circle, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

const EVENTS = [
  { title: "Delivered", note: "Handed to the receiver", time: "4:12 pm" },
  {
    title: "Out for delivery",
    note: "Rider is near the address",
    time: "2:40 pm",
  },
  {
    title: "Arrived at Chattogram hub",
    note: "Sorted for local delivery",
    time: "9:05 am",
  },
  {
    title: "In transit",
    note: "Dhaka hub to Chattogram hub",
    time: "Yesterday",
  },
  { title: "Picked up", note: "Collected from the sender", time: "Yesterday" },
];

export default function TrackingShowcase() {
  const [shown, setShown] = useState(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(EVENTS.length);
      return;
    }
    const id = setInterval(
      () => setShown((n) => (n >= EVENTS.length ? 1 : n + 1)),
      1500,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-ink-foreground md:py-28">
      <div
        aria-hidden="true"
        className="cg-grid-ink absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,#000,transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 lg:grid-cols-2">
        <div className="space-y-8">
          <SectionHeading
            invert
            title="Every step is on the record"
            description="No more guessing. Each status change is saved with a time, so you and your receiver always see the same story."
          />
          <ul className="space-y-3 text-ink-foreground/80">
            {[
              "Share one tracking code. No account needed to view it.",
              "Get a clear status at pickup, transit and delivery.",
              "Add notes to a shipment when something needs attention.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {t}
              </li>
            ))}
          </ul>
          <LinkButton href="/track" size="lg" className="h-11 px-5">
            Track a parcel
          </LinkButton>
        </div>

        <Reveal>
          <div className="rounded-3xl border border-white/10 bg-ink-muted/70 p-6 backdrop-blur md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Package className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold">CR-2026-048213</p>
                  <p className="text-xs text-ink-foreground/60">
                    Dhaka to Chattogram
                  </p>
                </div>
              </div>
              <Truck
                className="size-5 text-ink-foreground/50"
                aria-hidden="true"
              />
            </div>
            <ol
              className="relative space-y-5"
              aria-label="Example tracking history"
            >
              {EVENTS.slice()
                .reverse()
                .map((e, i) => {
                  const reached = i < shown;
                  return (
                    <li
                      key={e.title}
                      className={cn(
                        "flex gap-4 transition-opacity duration-500",
                        reached ? "opacity-100" : "opacity-30",
                      )}
                    >
                      <div className="flex flex-col items-center">
                        {reached ? (
                          <CheckCircle2
                            className="size-5 text-primary"
                            aria-hidden="true"
                          />
                        ) : (
                          <Circle
                            className="size-5 text-ink-foreground/40"
                            aria-hidden="true"
                          />
                        )}
                        {i < EVENTS.length - 1 && (
                          <span className="mt-1 w-px flex-1 bg-white/15" />
                        )}
                      </div>
                      <div className="-mt-0.5 flex-1 pb-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="font-medium">{e.title}</p>
                          <p className="text-xs text-ink-foreground/50">
                            {e.time}
                          </p>
                        </div>
                        <p className="text-sm text-ink-foreground/60">
                          {e.note}
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
