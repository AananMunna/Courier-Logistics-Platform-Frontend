import { Clock, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import ContactForm from "@/components/modules/contact/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Questions about a parcel, pricing or becoming a rider? Reach our support team by email or phone.",
  openGraph: { title: "Contact us", description: "Reach our support team." },
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-10 px-4 py-14 md:py-24">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
          We&apos;re here to help
        </h1>
        <p className="text-muted-foreground">
          Have your tracking code handy for the fastest answer.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {[
            {
              icon: Mail,
              label: "Email",
              value: siteConfig.supportEmail,
              href: `mailto:${siteConfig.supportEmail}`,
            },
            {
              icon: Phone,
              label: "Phone",
              value: siteConfig.supportPhone,
              href: `tel:${siteConfig.supportPhone}`,
            },
          ].map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <span className="rounded-xl bg-primary/10 p-3 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-muted-foreground">
                  {label}
                </span>
                <span className="font-medium">{value}</span>
              </span>
            </a>
          ))}
          <div className="flex items-center gap-4 rounded-2xl border bg-card p-4">
            <span className="rounded-xl bg-primary/10 p-3 text-primary">
              <Clock className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm text-muted-foreground">
                Support hours
              </span>
              <span className="font-medium">Sat – Thu, 9:00 AM – 9:00 PM</span>
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
