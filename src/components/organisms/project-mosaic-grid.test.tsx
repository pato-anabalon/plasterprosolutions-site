import { ProjectMosaicGrid } from "./project-mosaic-grid";
import type { ProjectGalleryPhoto } from "@/components/molecules/project-gallery-lightbox";
import { render, screen, setupUser } from "@/test/test-utils";

const photos: ProjectGalleryPhoto[] = [
  {
    category: "Interior",
    image: "/one.jpg",
    layout: "small",
    location: "Freemans Bay",
    title: "First project",
  },
  {
    category: "Exterior",
    image: "/two.jpg",
    layout: "wide",
    location: "Whitford",
    title: "Second project",
  },
];

describe("ProjectMosaicGrid", () => {
  it("should open the lightbox when a project image is selected", async () => {
    const user = setupUser();
    render(<ProjectMosaicGrid photos={photos} />);

    await user.click(
      screen.getByRole("button", { name: /open project image: first project/i }),
    );

    expect(
      screen.getByRole("dialog", { name: /first project full-size image/i }),
    ).toBeInTheDocument();
  });

  it("should navigate to the next image inside the lightbox", async () => {
    const user = setupUser();
    render(<ProjectMosaicGrid photos={photos} />);

    await user.click(
      screen.getByRole("button", { name: /open project image: first project/i }),
    );
    await user.click(screen.getByRole("button", { name: /next project image/i }));

    expect(
      screen.getByRole("dialog", { name: /second project full-size image/i }),
    ).toBeInTheDocument();
  });
});
