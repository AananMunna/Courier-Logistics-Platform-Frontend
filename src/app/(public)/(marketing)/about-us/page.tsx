import { Eye, HeartHandshake, ShieldCheck, Zap } from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { LinkButton } from "@/components/ui/link-button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About us",
  description: `Learn how ${siteConfig.name} connects senders, riders and hubs to deliver parcels reliably across Bangladesh.`,
  openGraph: {
    title: "About us",
    description: "Our mission and how we deliver.",
  },
};

const VALUES = [
  {
    icon: Eye,
    title: "Transparency",
    text: "Clear pricing and a status update at every step — no guessing.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    text: "Every rider is verified with NID and vehicle details before taking a single parcel.",
  },
  {
    icon: Zap,
    title: "Simplicity",
    text: "Booking should take two minutes, not twenty. We keep every flow short.",
  },
  {
    icon: HeartHandshake,
    title: "Care",
    text: "Fragile means fragile. We record exceptions and follow up on failures.",
  },
];

const NETWORK_STEPS = [
  {
    title: "Customer books",
    text: "Choose pickup and delivery hubs and see the fee instantly.",
  },
  {
    title: "Admin assigns",
    text: "A verified, available rider is matched to the parcel.",
  },
  {
    title: "Rider delivers",
    text: "Picked up, in transit, out for delivery, delivered.",
  },
  {
    title: "Everyone stays informed",
    text: "Each update is timestamped on the public tracking page.",
  },
] as const;

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-14 px-4 py-14 md:py-24">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
          Delivery you can actually follow
        </h1>
        <p className="text-lg text-muted-foreground text-balance">
          {siteConfig.name} powers hub-to-hub parcel delivery for individuals
          and online sellers. Customers book, admins dispatch verified riders,
          and riders carry each parcel from pickup to doorstep — with a full
          tracking history that everyone can see.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {VALUES.map(({ icon: Icon, title, text }, i) => (
          <Reveal
            key={title}
            delay={i * 70}
            className="group rounded-3xl border bg-card p-7 transition-shadow hover:shadow-[0_20px_50px_-30px_rgb(15_23_42/0.35)]"
          >
            <span className="mb-6 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
          </Reveal>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-ink-foreground md:p-12">
        <div
          aria-hidden="true"
          className="cg-grid-ink absolute inset-0 [mask-image:radial-gradient(ellipse_at_100%_0%,#000,transparent_65%)]"
        />
        <h2 className="relative text-2xl font-semibold tracking-tight">
          How the network works
        </h2>
        <ol className="relative mt-8 grid gap-6 md:grid-cols-2">
          {NETWORK_STEPS.map(({ title, text }, index) => (
            <Reveal
              as="li"
              key={title}
              delay={index * 80}
              className="flex gap-4"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <span className="space-y-1">
                <span className="block font-medium">{title}</span>
                <span className="block text-sm text-ink-foreground/70">
                  {text}
                </span>
              </span>
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="text-center">
        <LinkButton href="/register" size="lg" className="h-11 px-6 text-base">
          Get started
        </LinkButton>
      </div>
    </section>
  );
}
