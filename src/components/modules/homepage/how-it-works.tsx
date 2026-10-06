"use client";

import {
  BadgeCheck,
  Banknote,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  type LucideIcon,
  MapPinned,
  PackagePlus,
  ShieldCheck,
  Truck,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

interface Step {
  icon: LucideIcon;
  title: string;
  text: string;
  chip: string;
  rows: [string, string][];
}

const ROLES: Record<
  string,
  { label: string; icon: LucideIcon; steps: Step[] }
> = {
  customer: {
    label: "Sender",
    icon: PackagePlus,
    steps: [
      {
        icon: PackagePlus,
        title: "Book a pickup",
        text: "Add pickup address, receiver and parcel details.",
        chip: "Draft",
        rows: [
          ["Pickup", "Gulshan 2, Dhaka"],
          ["Receiver", "Sadia, Chattogram"],
          ["Parcel", "Electronics, 1.2 kg"],
        ],
      },
      {
        icon: CreditCard,
        title: "Pay your way",
        text: "Pay with bKash now, or collect cash on delivery.",
        chip: "Fee ready",
        rows: [
          ["Delivery fee", "৳ 168"],
          ["Collect on delivery", "৳ 2,400"],
          ["Payment", "bKash"],
        ],
      },
      {
        icon: UserCheck,
        title: "A rider picks up",
        text: "A verified rider is assigned and collects your parcel.",
        chip: "Rider assigned",
        rows: [
          ["Rider", "Rafiq A."],
          ["Vehicle", "Motorbike"],
          ["Pickup window", "Today, 2 to 4 pm"],
        ],
      },
      {
        icon: MapPinned,
        title: "Track to the door",
        text: "Follow every update until it is delivered.",
        chip: "In transit",
        rows: [
          ["Current hub", "Dhaka hub"],
          ["Next stop", "Chattogram hub"],
          ["Status", "In transit"],
        ],
      },
    ],
  },
  rider: {
    label: "Rider",
    icon: Truck,
    steps: [
      {
        icon: ClipboardCheck,
        title: "Apply and get verified",
        text: "Send your details. Our team reviews every application.",
        chip: "In review",
        rows: [
          ["Applicant", "Your name"],
          ["Vehicle", "Motorbike"],
          ["Review", "Pending approval"],
        ],
      },
      {
        icon: BadgeCheck,
        title: "Go online",
        text: "Switch availability on when you are ready for parcels.",
        chip: "Available",
        rows: [
          ["Availability", "On"],
          ["Area", "Dhaka"],
          ["Open parcels", "6 nearby"],
        ],
      },
      {
        icon: Truck,
        title: "Pick up and deliver",
        text: "Update each status as you collect and hand over.",
        chip: "Picked up",
        rows: [
          ["Parcel", "CR-2026-048213"],
          ["Next action", "Mark in transit"],
          ["Receiver", "Sadia"],
        ],
      },
      {
        icon: Wallet,
        title: "See your earnings",
        text: "Every completed delivery is added to your earnings.",
        chip: "Earned",
        rows: [
          ["Today", "৳ 1,240"],
          ["Deliveries", "9"],
          ["Cash collected", "৳ 7,300"],
        ],
      },
    ],
  },
  admin: {
    label: "Operations",
    icon: LayoutDashboard,
    steps: [
      {
        icon: Users,
        title: "Approve riders",
        text: "Review applications and approve trusted riders.",
        chip: "Pending",
        rows: [
          ["Applications", "4 waiting"],
          ["Latest", "Today"],
          ["Action", "Approve or reject"],
        ],
      },
      {
        icon: PackagePlus,
        title: "Assign parcels",
        text: "Match new bookings with available riders.",
        chip: "Unassigned",
        rows: [
          ["New bookings", "12"],
          ["Available riders", "7"],
          ["Action", "Assign rider"],
        ],
      },
      {
        icon: ShieldCheck,
        title: "Keep a clear record",
        text: "Every important action is stored in the audit log.",
        chip: "Logged",
        rows: [
          ["Actor", "Admin"],
          ["Action", "Rider assigned"],
          ["Time", "Just now"],
        ],
      },
      {
        icon: Banknote,
        title: "Watch the numbers",
        text: "Track shipments, payments and hubs from one place.",
        chip: "Live",
        rows: [
          ["Delivered today", "148"],
          ["Revenue", "৳ 38,420"],
          ["Active hubs", "8"],
        ],
      },
    ],
  },
};

const STEP_MS = 3600;

export default function HowItWorks() {
  const [role, setRole] = useState<keyof typeof ROLES>("customer");
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = ROLES[role];
  const stepCount = current.steps.length;

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const id = setTimeout(() => setStep((step + 1) % stepCount), STEP_MS);
    return () => clearTimeout(id);
  }, [step, paused, stepCount]);

  const active = current.steps[step];
  const ActiveIcon = active.icon;

  return (
    <section id="how-it-works" className="bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          title="See how CourierGo works for you"
          description="Pick your role. The panel on the right plays the exact flow."
        />

        <div
          role="tablist"
          aria-label="Choose a role"
          className="mt-8 inline-flex rounded-xl border bg-card p-1"
        >
          {Object.entries(ROLES).map(([key, r]) => {
            const Icon = r.icon;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={role === key}
                onClick={() => {
                  setRole(key);
                  setStep(0);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  role === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" /> {r.label}
              </button>
            );
          })}
        </div>

        {/* biome-ignore lint/a11y/noStaticElementInteractions: hover-to-pause is a pointer-only convenience; steps stay keyboard accessible */}
        <div
          className="mt-10 grid items-stretch gap-8 lg:grid-cols-[1fr_1.1fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <ol className="space-y-3">
            {current.steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all",
                      isActive
                        ? "border-primary/40 bg-card shadow-sm"
                        : "border-transparent hover:bg-card/60",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-card text-muted-foreground ring-1 ring-border",
                        )}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="space-y-0.5">
                        <span className="block font-semibold">{s.title}</span>
                        <span className="block text-sm text-muted-foreground">
                          {s.text}
                        </span>
                      </span>
                    </div>
                    {isActive && !paused && (
                      <span
                        key={`${role}-${step}`}
                        className="cg-fill absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                        style={
                          { "--cg-dur": `${STEP_MS}ms` } as React.CSSProperties
                        }
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <div
            className="rounded-3xl border bg-card p-3 shadow-[0_30px_70px_-40px_rgb(15_23_42/0.4)]"
            aria-live="polite"
          >
            <div
              className="flex items-center gap-1.5 px-3 py-2"
              aria-hidden="true"
            >
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
            </div>
            <div
              key={`${role}-${step}`}
              className="cg-pop rounded-2xl bg-muted/50 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ActiveIcon className="size-6" aria-hidden="true" />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-medium ring-1 ring-border">
                  <CheckCircle2
                    className="size-3.5 text-primary"
                    aria-hidden="true"
                  />{" "}
                  {active.chip}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{active.title}</h3>
              <dl className="mt-5 divide-y rounded-xl bg-card ring-1 ring-border">
                {active.rows.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
