import { ProjectGalleryLightbox, type ProjectGalleryPhoto } from "./project-gallery-lightbox";
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

const defaultProps = {
  activeIndex: 0,
  onClose: jest.fn(),
  onNext: jest.fn(),
  onPrevious: jest.fn(),
  photos,
};

function setup(props = {}) {
  const user = setupUser();
  render(<ProjectGalleryLightbox {...defaultProps} {...props} />);

  return { user };
}

describe("ProjectGalleryLightbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = "";
  });

  it("should not render when there is no active image", () => {
    setup({ activeIndex: null });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render the active image details and lock body scroll", () => {
    setup();

    expect(screen.getByRole("dialog", { name: /first project full-size image/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /first project/i })).toBeInTheDocument();
    expect(screen.getByText("Freemans Bay")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should call navigation callbacks from buttons and keyboard", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /next project image/i }));
    await user.click(screen.getByRole("button", { name: /previous project image/i }));
    await user.keyboard("{ArrowRight}{ArrowLeft}{Escape}");

    expect(defaultProps.onNext).toHaveBeenCalledTimes(2);
    expect(defaultProps.onPrevious).toHaveBeenCalledTimes(2);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
