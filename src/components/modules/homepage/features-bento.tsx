import {
  BadgeCheck,
  Banknote,
  Building2,
  ClipboardList,
  Smartphone,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Verified riders only",
    text: "Every rider application is reviewed by our team before they can accept a parcel.",
    span: "lg:col-span-2",
  },
  {
    icon: Smartphone,
    title: "Pay securely with bKash",
    text: "Pay the delivery fee online from your shipment page.",
    span: "",
  },
  {
    icon: Banknote,
    title: "Cash on delivery, recorded",
    text: "The collected amount is saved automatically when the parcel is delivered.",
    span: "",
  },
  {
    icon: Building2,
    title: "A real hub network",
    text: "Parcels move hub to hub, then to the door, so every leg is scanned and logged.",
    span: "lg:col-span-2",
  },
  {
    icon: ClipboardList,
    title: "Full audit trail",
    text: "Important actions are logged so nothing happens without a record.",
    span: "",
  },
  {
    icon: Zap,
    title: "Price before you book",
    text: "See the fee up front. No surprise charges at pickup.",
    span: "",
  },
];

export default function FeaturesBento() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
      <SectionHeading
        title="Built so you can trust it with what matters"
        description="Safety, clear pricing and a record of everything, from the first tap."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text, span }, i) => (
          <Reveal
            key={title}
            delay={i * 50}
            className={cn(
              "group rounded-3xl border bg-card p-7 transition-shadow hover:shadow-[0_20px_50px_-30px_rgb(15_23_42/0.35)]",
              span,
            )}
          >
            <span className="mb-10 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              {text}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
