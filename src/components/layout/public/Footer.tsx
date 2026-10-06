import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import { publicNavigation, siteConfig } from "@/config/site";

const ACCOUNT = [
  { name: "Log in", url: "/login" },
  { name: "Create account", url: "/register" },
  { name: "Become a rider", url: "/apply" },
  { name: "Reset password", url: "/forgot-password" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-ink-foreground">
      <div
        aria-hidden="true"
        className="cg-grid-ink absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-16 pb-10 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo className="size-9" />
            <span className="text-xl tracking-tight">{siteConfig.name}</span>
          </Link>
          <p className="max-w-xs text-sm text-ink-foreground/70">
            {siteConfig.tagline}
          </p>
        </div>

        <nav aria-label="Footer" className="space-y-4">
          <p className="text-sm font-semibold">Explore</p>
          <ul className="space-y-2.5 text-sm text-ink-foreground/70">
            {publicNavigation.map((route) => (
              <li key={route.url}>
                <Link
                  href={route.url}
                  className="transition-colors hover:text-ink-foreground"
                >
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Account" className="space-y-4">
          <p className="text-sm font-semibold">Account</p>
          <ul className="space-y-2.5 text-sm text-ink-foreground/70">
            {ACCOUNT.map((route) => (
              <li key={route.url}>
                <Link
                  href={route.url}
                  className="transition-colors hover:text-ink-foreground"
                >
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4">
          <p className="text-sm font-semibold">Support</p>
          <ul className="space-y-2.5 text-sm text-ink-foreground/70">
            <li>
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="flex items-center gap-2 transition-colors hover:text-ink-foreground"
              >
                <Mail className="size-4" aria-hidden="true" />{" "}
                {siteConfig.supportEmail}
              </a>
            </li>
            <li>
              <a
                href={`tel:${siteConfig.supportPhone}`}
                className="flex items-center gap-2 transition-colors hover:text-ink-foreground"
              >
                <Phone className="size-4" aria-hidden="true" />{" "}
                {siteConfig.supportPhone}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-ink-foreground/50">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
