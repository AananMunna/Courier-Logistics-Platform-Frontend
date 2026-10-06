import { Check } from "lucide-react";
import type { Metadata } from "next";
import FeeCalculator from "@/components/modules/pricing/fee-calculator";
import { pricingConfig } from "@/config/pricing";
import { formatCurrency } from "@/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent delivery pricing: a small base fee plus per-kg and per-km rates. Estimate your fee instantly.",
  openGraph: {
    title: "Pricing",
    description: "Transparent courier pricing with an instant fee calculator.",
  },
};

const FAQ = [
  {
    q: "How is the delivery fee calculated?",
    a: `Base fee (${formatCurrency(pricingConfig.baseFee)}) + ${formatCurrency(pricingConfig.perKgFee)} per kg + ${formatCurrency(pricingConfig.perKmFee)} per km. You see the exact total before confirming.`,
  },
  {
    q: "Can I pay when my parcel is delivered?",
    a: "Yes. Choose cash on delivery and enter the amount to collect. It's marked paid automatically once the parcel is delivered.",
  },
  {
    q: "Can I cancel a booking?",
    a: "You can cancel any time before your parcel is picked up, from the shipment page.",
  },
  {
    q: "What if delivery fails?",
    a: "We record the reason, and our team re-assigns a rider or returns the parcel to you.",
  },
];

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-12 px-4 py-14 md:py-24">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
          Simple, honest pricing
        </h1>
        <p className="text-muted-foreground">
          No hidden charges. Pay for weight and distance — that&apos;s it.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FeeCalculator />
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">What&apos;s included</h2>
          <ul className="space-y-3 text-sm">
            {[
              "Pickup from your address by a verified rider",
              "Hub-to-hub transfer and doorstep delivery",
              "Live tracking page you can share with the receiver",
              "bKash online payment or cash on delivery",
              "Free cancellation before pickup",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="divide-y rounded-2xl border bg-card">
          {FAQ.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-medium marker:hidden">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
