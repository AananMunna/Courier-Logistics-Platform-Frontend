import { BadgeCheck, MapPinned, Wallet } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "@/assets/svg/Logo";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import LiveRoute from "../modules/homepage/live-route";

const POINTS = [
  { icon: MapPinned, text: "Live tracking from hub to doorstep" },
  { icon: Wallet, text: "Pay with bKash or cash on delivery" },
  { icon: BadgeCheck, text: "Verified riders, transparent pricing" },
];

export default function AuthShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col gap-6 p-5 md:p-10">
        <Link href="/" className="flex w-fit items-center gap-2 font-semibold">
          <Logo className="size-8" />
          <span className="text-lg tracking-tight">{siteConfig.name}</span>
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <div className={cn("w-full", wide ? "max-w-lg" : "max-w-sm")}>
            {children}
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Your details are used only to run your deliveries.
        </p>
      </div>
      <aside className="relative hidden overflow-hidden bg-ink text-ink-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="cg-grid-ink absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_40%,#000,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 size-96 rounded-full bg-primary/25 blur-3xl"
        />
        <h2 className="relative max-w-md text-3xl leading-tight font-semibold tracking-tight text-balance">
          Parcels delivered, peace of mind included.
        </h2>
        <div className="relative scale-[0.92]">
          <LiveRoute />
        </div>
        <ul className="relative space-y-3">
          {POINTS.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-3 text-sm/6 text-ink-foreground/80"
            >
              <span className="rounded-full bg-white/10 p-2">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
