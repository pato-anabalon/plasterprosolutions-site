import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/data/site";

describe("metadata routes", () => {
  it("should expose public robots rules and sitemap URL", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: `${siteConfig.url}/sitemap.xml`,
    });
  });

  it("should include all public pages in the sitemap", () => {
    const entries = sitemap();

    expect(entries).toHaveLength(7);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          changeFrequency: "weekly",
          priority: 1,
          url: siteConfig.url,
        }),
        expect.objectContaining({
          changeFrequency: "monthly",
          priority: 0.8,
          url: `${siteConfig.url}/terms-of-service`,
        }),
      ]),
    );
    expect(entries[0].lastModified).toBeInstanceOf(Date);
  });
});
