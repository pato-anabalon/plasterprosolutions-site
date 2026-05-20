import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getProjectPostSlugs } from "@/lib/project-posts";

const routes = [
  "",
  "/services",
  "/projects",
  "/about",
  "/real-estate",
  "/contact",
  "/terms-of-service",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectPostRoutes = (await getProjectPostSlugs()).map(
    (slug) => `/projects/${slug}`,
  );

  return [...routes, ...projectPostRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route.startsWith("/projects/") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/projects/") ? 0.7 : 0.8,
  }));
}
