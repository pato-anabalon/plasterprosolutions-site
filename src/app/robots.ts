import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/contact/direct-quotient-backup", "/contact/zapier-backup"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
