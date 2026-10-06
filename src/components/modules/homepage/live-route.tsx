"use client";

import { BadgeCheck, Banknote, MapPin, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Booked", note: "Pickup requested from Gulshan, Dhaka" },
  { label: "Rider assigned", note: "Rafiq is on the way to pick up" },
  { label: "Picked up", note: "Parcel collected and scanned" },
  { label: "In transit", note: "Moving from Dhaka hub to Chattogram hub" },
  { label: "Delivered", note: "Handed over at the doorstep" },
] as const;

const STEP_MS = 2400;
const ROUTE = "M 40 230 C 120 230, 120 120, 210 130 S 330 60, 400 70";

export default function LiveRoute() {
  const [step, setStep] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReduce(prefersReduced);
    if (prefersReduced) {
      setStep(3);
      return;
    }
    const id = setInterval(
      () => setStep((s) => (s + 1) % STEPS.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_60%)] blur-2xl"
      />

      <div className="overflow-hidden rounded-3xl border bg-card shadow-[0_30px_80px_-30px_rgb(15_23_42/0.35)]">
        <div className="flex items-center justify-between border-b px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="size-4" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Parcel CR-2026-048213</p>
              <p className="text-xs text-muted-foreground">
                Dhaka to Chattogram
              </p>
            </div>
          </div>
          <span
            key={step}
            className="cg-pop inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
          >
            <span className="relative flex size-1.5">
              <span className="cg-ping absolute inset-0 rounded-full bg-primary" />
              <span className="relative size-1.5 rounded-full bg-primary" />
            </span>
            {STEPS[step].label}
          </span>
        </div>

        <div className="relative bg-muted/50">
          <div
            aria-hidden="true"
            className="cg-grid-bg absolute inset-0 opacity-70"
          />
          <svg
            viewBox="0 0 440 280"
            className="relative block w-full"
            role="img"
            aria-label="A parcel travelling along a route between two hubs"
          >
            <path
              d={ROUTE}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="cg-dash text-foreground/25"
            />
            <path
              id="cg-route"
              d={ROUTE}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="100"
              strokeDashoffset={100 - (step / (STEPS.length - 1)) * 100}
              style={{ transition: `stroke-dashoffset ${STEP_MS}ms linear` }}
            />
            <g>
              <circle
                cx="40"
                cy="230"
                r="7"
                fill="var(--card)"
                stroke="var(--foreground)"
                strokeWidth="2"
              />
              <circle
                cx="400"
                cy="70"
                r="7"
                fill="var(--card)"
                stroke="var(--foreground)"
                strokeWidth="2"
              />
            </g>
            <text
              x="40"
              y="256"
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-medium"
            >
              Dhaka hub
            </text>
            <text
              x="400"
              y="52"
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-medium"
            >
              Chattogram hub
            </text>
            {!reduce && (
              <g>
                <circle r="16" fill="var(--primary)" opacity="0.18" />
                <circle
                  r="8"
                  fill="var(--primary)"
                  stroke="var(--card)"
                  strokeWidth="3"
                />
                <animateMotion
                  dur={`${(STEP_MS * STEPS.length) / 1000}s`}
                  repeatCount="indefinite"
                  rotate="0"
                >
                  <mpath href="#cg-route" />
                </animateMotion>
              </g>
            )}
          </svg>

          <div className="cg-float absolute top-4 left-4 flex items-center gap-2 rounded-xl border bg-card/95 px-3 py-2 text-xs shadow-sm backdrop-blur">
            <Banknote className="size-4 text-emerald-600" aria-hidden="true" />
            <span className="font-medium">Cash on delivery</span>
          </div>
        </div>

        <ol className="grid grid-cols-5 gap-1 px-5 pt-5">
          {STEPS.map((s, i) => (
            <li key={s.label} className="space-y-2">
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                {i < step && (
                  <div className="h-full w-full rounded-full bg-primary" />
                )}
                {i === step && (
                  <div
                    key={step}
                    className="cg-fill h-full rounded-full bg-primary"
                    style={
                      { "--cg-dur": `${STEP_MS}ms` } as React.CSSProperties
                    }
                  />
                )}
              </div>
              <p
                className={cn(
                  "hidden text-[11px] leading-tight sm:block",
                  i <= step
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {s.label}
              </p>
            </li>
          ))}
        </ol>
        <div
          className="flex items-start gap-2.5 px-5 pt-3 pb-5"
          aria-live="polite"
        >
          <MapPin
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p key={step} className="cg-pop text-sm text-muted-foreground">
            {STEPS[step].note}
          </p>
        </div>
      </div>

      <div className="cg-float absolute -right-2 -bottom-5 hidden items-center gap-2 rounded-2xl border bg-card px-3.5 py-2.5 text-xs shadow-lg [animation-delay:-3s] sm:flex">
        <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
        <span className="font-medium">Verified rider</span>
      </div>
    </div>
  );
}
