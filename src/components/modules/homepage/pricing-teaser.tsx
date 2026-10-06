import { pricingConfig } from "@/config/pricing";
import { formatCurrency } from "@/utils";
import FeeCalculator from "../pricing/fee-calculator";
import { SectionHeading } from "./section-heading";

export default function PricingTeaser() {
  const parts = [
    { label: "Base fee", value: formatCurrency(pricingConfig.baseFee) },
    { label: "Per kg", value: formatCurrency(pricingConfig.perKgFee) },
    { label: "Per km", value: formatCurrency(pricingConfig.perKmFee) },
  ];
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:py-28 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-8">
        <SectionHeading
          title="Know the price before you book"
          description="One simple formula. Try your own weight and distance on the right."
        />
        <dl className="grid grid-cols-3 divide-x rounded-2xl border bg-card">
          {parts.map((p) => (
            <div key={p.label} className="p-4 text-center">
              <dt className="text-xs text-muted-foreground">{p.label}</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {p.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <FeeCalculator />
    </section>
  );
}
