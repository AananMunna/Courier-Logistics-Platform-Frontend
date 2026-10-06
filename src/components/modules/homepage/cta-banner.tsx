import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";

export default function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center text-ink-foreground md:px-16 md:py-24">
        <div
          aria-hidden="true"
          className="cg-grid-ink absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-5xl">
            Your first parcel is two minutes away
          </h2>
          <p className="text-ink-foreground/70">
            Create a free account, book a pickup and share the tracking code.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton
              href="/register"
              size="lg"
              className="h-12 px-6 text-base"
            >
              Create free account <ArrowRight />
            </LinkButton>
            <LinkButton
              href="/track"
              size="lg"
              variant="outline"
              className="h-12 border-white/20 bg-white/5 px-6 text-base text-ink-foreground hover:bg-white/10"
            >
              Track a parcel
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
