import {
  FileText,
  Package,
  Smartphone,
  Utensils,
  Wine,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { PARCEL_TYPES } from "@/constants";
import { SectionHeading } from "./section-heading";

const ICONS = {
  DOCUMENT: FileText,
  PARCEL: Package,
  FRAGILE: Wine,
  ELECTRONICS: Smartphone,
  FOOD: Utensils,
  OTHER: Zap,
} as const;

export default function ServiceHighlights() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
      <SectionHeading
        title="Whatever you send, it is handled with care"
        description="Choose the parcel type when you book so the rider arrives prepared."
      />
      <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {PARCEL_TYPES.map((type, i) => {
          const Icon = ICONS[type.value];
          return (
            <Reveal
              key={type.value}
              delay={i * 60}
              className="group bg-card p-7 transition-colors hover:bg-primary/[0.03]"
            >
              <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground transition-all duration-300 group-hover:-rotate-6 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold">{type.label}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {type.hint}
              </p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
