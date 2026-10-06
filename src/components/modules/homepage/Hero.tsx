import { ArrowRight, BadgeCheck, MapPinned, Zap } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import TrackForm from "../tracking/track-form";
import LiveRoute from "./live-route";

const TRUST = [
  { icon: Zap, label: "Book in minutes" },
  { icon: BadgeCheck, label: "Verified riders" },
  { icon: MapPinned, label: "Live tracking" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="cg-grid-bg absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pt-12 pb-20 md:pt-20 md:pb-28 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-7">
          <h1 className="max-w-xl text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Send it today. Watch it arrive.
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground text-balance">
            Book a pickup in two minutes, pay with bKash or cash on delivery,
            and follow your parcel from our hub to the receiver&apos;s door.
          </p>

          <div className="max-w-lg space-y-2.5">
            <TrackForm size="large" />
            <p className="text-sm text-muted-foreground">
              Have a tracking code? Paste it here for the live status.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton
              href="/register"
              size="lg"
              className="h-12 px-6 text-base shadow-[0_10px_30px_-10px_var(--primary)]"
            >
              Send a parcel <ArrowRight />
            </LinkButton>
            <LinkButton
              href="/pricing"
              variant="outline"
              size="lg"
              className="h-12 px-6 text-base"
            >
              See pricing
            </LinkButton>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon className="size-4 text-primary" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <LiveRoute />
      </div>
    </section>
  );
}
