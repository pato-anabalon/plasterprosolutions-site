import {
  calculateReadingTime,
  extractMarkdownExcerpt,
  extractMarkdownTitle,
  getPublishedProjectPosts,
  getSeedProjectPosts,
  toProjectGalleryPhotos,
} from "@/lib/project-posts";

describe("project posts data", () => {
  const posts = getSeedProjectPosts();

  it("should expose the first ten markdown project posts as published seeds", () => {
    expect(posts).toHaveLength(10);
    expect(posts.every((post) => post.status === "published")).toBe(true);
  });

  it("should generate unique slugs and image galleries from project folders", () => {
    const slugs = posts.map((post) => post.slug);
    const remuera = posts.find((post) => post.imageFolder === "remuera");

    expect(new Set(slugs).size).toBe(posts.length);
    expect(remuera?.images).toHaveLength(21);
    expect(remuera?.heroImage).toBe("/assets/projects/remuera/1.jpeg");
  });

  it("should derive title, excerpt, and reading time from markdown", () => {
    const markdown = [
      "# A Sharp Exterior Finish",
      "",
      "This first paragraph explains the project clearly.",
      "",
      "## Scope",
      "",
      "- Preparation",
    ].join("\n");

    expect(extractMarkdownTitle(markdown)).toBe("A Sharp Exterior Finish");
    expect(extractMarkdownExcerpt(markdown)).toBe(
      "This first paragraph explains the project clearly.",
    );
    expect(calculateReadingTime(markdown)).toBe(1);
  });

  it("should adapt post images to the existing ProjectMosaicGallery contract", () => {
    const photos = toProjectGalleryPhotos(posts[0]);

    expect(photos[0]).toEqual(
      expect.objectContaining({
        category: posts[0].category,
        image: posts[0].heroImage,
        layout: "featured",
        location: posts[0].location,
        title: expect.any(String),
      }),
    );
  });

  it("should use seed posts as the fallback when the database is not configured", async () => {
    const originalDatabaseUrl = process.env.DATABASE_URL;
    const originalPostgresUrl = process.env.POSTGRES_URL;

    delete process.env.DATABASE_URL;
    delete process.env.POSTGRES_URL;

    await expect(getPublishedProjectPosts()).resolves.toHaveLength(10);

    process.env.DATABASE_URL = originalDatabaseUrl;
    process.env.POSTGRES_URL = originalPostgresUrl;
  });
});
