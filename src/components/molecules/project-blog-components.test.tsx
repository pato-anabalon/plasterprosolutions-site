import { track } from "@vercel/analytics";
import { ProjectLikeButton } from "@/components/molecules/project-like-button";
import { ProjectPostCard } from "@/components/molecules/project-post-card";
import { ProjectShareButton } from "@/components/molecules/project-share-button";
import { getSeedProjectPosts } from "@/lib/project-posts";
import { render, screen, setupUser, waitFor } from "@/test/test-utils";

const post = getSeedProjectPosts()[0];

describe("project blog components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("should render a project card that links to the project story", async () => {
    const user = setupUser();

    render(<ProjectPostCard post={post} />);

    const link = screen.getByRole("link", {
      name: `Read project story: ${post.title}`,
    });

    expect(link).toHaveAttribute("href", `/projects/${post.slug}`);
    expect(screen.getByRole("heading", { name: post.title })).toBeInTheDocument();

    link.addEventListener("click", (event) => event.preventDefault());
    await user.click(link);

    expect(track).toHaveBeenCalledWith("Project Card Clicked", {
      slug: post.slug,
      title: post.title,
    });
  });

  it("should update the visible like count after a successful like", async () => {
    const user = setupUser();
    let resolveLike: (value: Response) => void = jest.fn();

    global.fetch = jest.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveLike = resolve;
        }),
    );

    render(
      <ProjectLikeButton
        enabled
        initialCount={7}
        slug={post.slug}
        title={post.title}
      />,
    );

    await user.click(screen.getByRole("button", { name: /like this project/i }));

    expect(screen.getByTestId("project-like-button-heart")).toHaveClass(
      "project-like-heart-pending",
    );

    resolveLike({
      json: async () => ({ count: 8, ok: true }),
      ok: true,
    } as Response);

    expect(await screen.findByText("8")).toBeInTheDocument();
    expect(screen.getByTestId("project-like-button-burst")).toHaveClass(
      "is-active",
    );
    await waitFor(() =>
      expect(screen.getByTestId("project-like-button-heart")).not.toHaveClass(
        "project-like-heart-pending",
      ),
    );
    expect(window.localStorage.getItem(`plasterpro-project-like:${post.slug}`)).toBe(
      "true",
    );
  });

  it("should disable the like button when likes are not configured", () => {
    render(
      <ProjectLikeButton
        enabled={false}
        initialCount={0}
        slug={post.slug}
        title={post.title}
      />,
    );

    expect(screen.getByRole("button", { name: /like this project/i })).toBeDisabled();
  });

  it("should copy the project URL from the share button", async () => {
    const user = setupUser();

    render(<ProjectShareButton slug={post.slug} title={post.title} />);

    await user.click(screen.getByRole("button", { name: /share/i }));

    expect(await screen.findByRole("button", { name: /copied/i })).toBeInTheDocument();
    expect(track).toHaveBeenCalledWith("Project Share Clicked", {
      slug: post.slug,
      title: post.title,
    });
  });
});
