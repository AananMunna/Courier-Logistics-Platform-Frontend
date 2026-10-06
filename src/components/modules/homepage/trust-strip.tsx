import { CountUp } from "@/components/motion/count-up";
import { PAYMENT_METHODS, STATS } from "@/config/landing";

export default function TrustStrip() {
  const items = [...PAYMENT_METHODS, ...PAYMENT_METHODS];
  return (
    <section aria-label="Why customers trust us" className="border-y bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 md:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="px-2 text-center md:border-l md:first:border-l-0"
          >
            <p className="text-3xl font-bold tracking-tight md:text-4xl">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
      <div
        className="overflow-hidden border-t py-3.5 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
        aria-hidden="true"
      >
        <div className="cg-marquee flex w-max gap-10 text-sm font-medium text-muted-foreground">
          {items.map((label, i) => (
            <span key={`${label}-${i}`} className="flex items-center gap-10">
              {label}
              <span className="size-1 rounded-full bg-primary/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
