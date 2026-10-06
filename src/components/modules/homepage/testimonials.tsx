import { Reveal } from "@/components/motion/reveal";
import { SHOW_TESTIMONIALS, TESTIMONIALS } from "@/config/landing";
import { SectionHeading } from "./section-heading";

export default function Testimonials() {
  if (!SHOW_TESTIMONIALS) {
    return null;
  }
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
      <SectionHeading
        align="center"
        title="People send with us again and again"
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 80}>
            <figure className="flex h-full flex-col justify-between gap-8 rounded-3xl border bg-card p-7">
              <blockquote className="text-pretty">{t.quote}</blockquote>
              <figcaption className="flex items-center gap-3">
                <span
                  className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                  aria-hidden="true"
                >
                  {t.name[0]}
                </span>
                <span className="text-sm">
                  <span className="block font-medium">{t.name}</span>
                  <span className="text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
