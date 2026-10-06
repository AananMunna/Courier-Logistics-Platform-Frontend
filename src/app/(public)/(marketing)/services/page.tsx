import {
  Banknote,
  FileText,
  Package,
  Smartphone,
  Utensils,
  Wine,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/link-button";
import { PARCEL_TYPES } from "@/constants";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Document, parcel, fragile, electronics and food delivery with live tracking, bKash payment and cash on delivery.",
  openGraph: {
    title: "Services",
    description: "What you can send with us, and how we deliver it.",
  },
};

const ICONS = {
  DOCUMENT: FileText,
  PARCEL: Package,
  FRAGILE: Wine,
  ELECTRONICS: Smartphone,
  FOOD: Utensils,
  OTHER: Zap,
} as const;

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:py-24">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
          What you can send
        </h1>
        <p className="text-muted-foreground">
          From a single document to a boxed order — we handle it with care.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARCEL_TYPES.map((type) => {
          const Icon = ICONS[type.value];
          return (
            <article
              key={type.value}
              className="group rounded-3xl border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-30px_rgb(15_23_42/0.35)]"
            >
              <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="font-semibold">{type.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{type.hint}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 rounded-3xl bg-ink p-6 text-ink-foreground md:grid-cols-2 md:p-10">
        <div className="space-y-2">
          <Banknote className="size-7 text-primary" aria-hidden="true" />
          <h2 className="text-xl font-semibold">Cash on delivery</h2>
          <p className="text-sm text-muted-foreground">
            Add the amount to collect when you book. The rider collects it from
            the receiver and it&apos;s recorded automatically on delivery.
          </p>
        </div>
        <div className="space-y-2">
          <Smartphone className="size-7 text-primary" aria-hidden="true" />
          <h2 className="text-xl font-semibold">Pay online with bKash</h2>
          <p className="text-sm text-muted-foreground">
            Prefer to pay upfront? Pay the delivery fee securely through bKash
            right from your shipment page.
          </p>
        </div>
      </div>

      <div className="text-center">
        <LinkButton href="/register" size="lg" className="h-11 px-6 text-base">
          Book a pickup
        </LinkButton>
      </div>
    </section>
  );
}
