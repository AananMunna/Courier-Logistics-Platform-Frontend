import { PackagePlus } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import TrackForm from "../tracking/track-form";
import { CustomerGreeting } from "./customer-greeting";

/** Server Component: static markup ships as HTML; only TrackForm + greeting hydrate. */
export function CustomerHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-ink p-6 text-ink-foreground md:p-9">
      <div
        aria-hidden="true"
        className="cg-grid-ink absolute inset-0 [mask-image:radial-gradient(ellipse_at_80%_20%,#000,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-10 size-64 rounded-full bg-primary/30 blur-3xl"
      />
      <div className="relative grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            <CustomerGreeting />
          </h1>
          <p className="max-w-md text-sm text-ink-foreground/70">
            Book a pickup in a few taps, or check on a parcel that is on its
            way.
          </p>
          <LinkButton
            href="/dashboard/shipments/new"
            size="lg"
            className="mt-3 h-11 px-5"
          >
            <PackagePlus /> Send a parcel
          </LinkButton>
        </div>
        <div className="space-y-2 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10">
          <p className="text-sm font-medium">Track any parcel</p>
          <TrackForm />
        </div>
      </div>
    </section>
  );
}
