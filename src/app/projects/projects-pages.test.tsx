import ProjectsPage from "@/app/projects/page";
import ProjectPostPage, { generateMetadata } from "@/app/projects/[slug]/page";
import { getSeedProjectPosts } from "@/lib/project-posts";
import { render, screen } from "@/test/test-utils";

describe("project blog pages", () => {
  const post = getSeedProjectPosts()[0];

  it("should render the projects index with blog cards", async () => {
    render(await ProjectsPage());

    expect(
      screen.getByRole("heading", {
        name: /a closer look at the work behind each finish/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `Read project story: ${post.title}`,
      }),
    ).toHaveAttribute("href", `/projects/${post.slug}`);
  });

  it("should generate metadata for a project post", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: post.slug }),
    });

    expect(metadata).toEqual(
      expect.objectContaining({
        description: post.seoDescription,
        title: post.seoTitle,
      }),
    );
  });

  it("should render a project post page with the article body", async () => {
    render(
      await ProjectPostPage({
        params: Promise.resolve({ slug: post.slug }),
      }),
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: post.title,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(`${post.readingTimeMinutes} min read`)).toBeInTheDocument();
    expect(screen.getByText(/project gallery/i)).toBeInTheDocument();
  });
});
