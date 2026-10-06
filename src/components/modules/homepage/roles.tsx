import { ArrowRight, Bike, PackageCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { LinkButton } from "@/components/ui/link-button";
import { SectionHeading } from "./section-heading";

export default function Roles() {
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          align="center"
          title="Two ways to be part of CourierGo"
          description="Send parcels, or earn by delivering them."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal className="group relative overflow-hidden rounded-3xl border bg-card p-8 md:p-10">
            <PackageCheck
              className="mb-8 size-10 text-primary transition-transform duration-500 group-hover:-translate-y-1"
              aria-hidden="true"
            />
            <h3 className="text-2xl font-semibold">Send parcels</h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              For shops, freelancers and families. Book, pay and track from one
              dashboard.
            </p>
            <LinkButton href="/register" size="lg" className="mt-8 h-11 px-5">
              Create an account <ArrowRight />
            </LinkButton>
          </Reveal>
          <Reveal
            delay={80}
            className="group relative overflow-hidden rounded-3xl bg-ink p-8 text-ink-foreground md:p-10"
          >
            <div
              aria-hidden="true"
              className="cg-grid-ink absolute inset-0 opacity-70"
            />
            <div className="relative">
              <Bike
                className="mb-8 size-10 text-primary transition-transform duration-500 group-hover:translate-x-1"
                aria-hidden="true"
              />
              <h3 className="text-2xl font-semibold">Deliver with us</h3>
              <p className="mt-2 max-w-sm text-ink-foreground/70">
                Apply, get verified, then pick the parcels that suit your day
                and see your earnings.
              </p>
              <LinkButton
                href="/apply"
                size="lg"
                variant="outline"
                className="mt-8 h-11 border-white/20 bg-white/5 px-5 text-ink-foreground hover:bg-white/10"
              >
                Become a rider <ArrowRight />
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
