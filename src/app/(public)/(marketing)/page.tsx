import type { Metadata } from "next";
import Coverage from "@/components/modules/homepage/coverage";
import CtaBanner from "@/components/modules/homepage/cta-banner";
import Faq from "@/components/modules/homepage/faq";
import FeaturesBento from "@/components/modules/homepage/features-bento";
import Hero from "@/components/modules/homepage/Hero";
import HowItWorks from "@/components/modules/homepage/how-it-works";
import PricingTeaser from "@/components/modules/homepage/pricing-teaser";
import Roles from "@/components/modules/homepage/roles";
import ServiceHighlights from "@/components/modules/homepage/service-highlights";
import Testimonials from "@/components/modules/homepage/testimonials";
import TrackingShowcase from "@/components/modules/homepage/tracking-showcase";
import TrustStrip from "@/components/modules/homepage/trust-strip";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — Courier & parcel delivery in Bangladesh`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — Courier & parcel delivery`,
    description: siteConfig.description,
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServiceHighlights />
      <HowItWorks />
      <TrackingShowcase />
      <FeaturesBento />
      <Roles />
      <PricingTeaser />
      <Coverage />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </>
  );
}
