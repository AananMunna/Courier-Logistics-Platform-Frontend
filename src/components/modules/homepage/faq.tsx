import { Plus } from "lucide-react";
import { FAQS } from "@/config/landing";
import { SectionHeading } from "./section-heading";

export default function Faq() {
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          title="Questions people ask before booking"
          description="Still unsure? Our support team replies quickly from the contact page."
        />
        <div className="divide-y rounded-3xl border bg-card">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium outline-none focus-visible:text-primary">
                {f.q}
                <Plus
                  className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="cg-pop mt-3 max-w-prose text-sm text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
