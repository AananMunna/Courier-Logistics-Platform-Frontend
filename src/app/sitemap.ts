import type { MetadataRoute } from "next";
import { publicNavigation, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicNavigation.map((route) => ({
    url: `${siteConfig.url}${route.url === "/" ? "" : route.url}`,
    changeFrequency: route.url === "/" ? "weekly" : "monthly",
    priority: route.url === "/" ? 1 : 0.7,
  }));
}
