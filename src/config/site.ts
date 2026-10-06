export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "CourierGo",
  tagline: "Send parcels across Bangladesh, track every step.",
  description:
    "Book a pickup, pay securely with bKash or cash on delivery, and follow your parcel from hub to doorstep in real time.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@couriergo.app",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+8801700000000",
} as const;

export const publicNavigation = [
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "Pricing", url: "/pricing" },
  { name: "Hubs", url: "/hubs" },
  { name: "Track", url: "/track" },
  { name: "About", url: "/about-us" },
  { name: "Contact", url: "/contact" },
] as const;
