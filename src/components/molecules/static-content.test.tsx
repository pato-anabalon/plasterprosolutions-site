import { Hammer, Paintbrush } from "lucide-react";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { CheckListItem } from "@/components/molecules/check-list-item";
import { FeatureCard } from "@/components/molecules/feature-card";
import { HighlightStat } from "@/components/molecules/highlight-stat";
import { LogoMarquee } from "@/components/molecules/logo-marquee";
import { PersonCard } from "@/components/molecules/person-card";
import { ReviewCard } from "@/components/molecules/review-card";
import { SectionHeading } from "@/components/molecules/section-heading";
import { StaggeredImagePair } from "@/components/molecules/staggered-image-pair";
import { StatementCard } from "@/components/molecules/statement-card";
import { BrandLogo } from "@/components/atoms/brand-logo";
import { render, screen } from "@/test/test-utils";

describe("static content molecules", () => {
  it("should render AnimatedReveal children", () => {
    render(
      <AnimatedReveal>
        <p>Visible content</p>
      </AnimatedReveal>,
    );

    expect(screen.getByText(/visible content/i)).toBeInTheDocument();
  });

  it("should render CheckListItem text", () => {
    render(<CheckListItem>Clear site communication</CheckListItem>);

    expect(screen.getByText(/clear site communication/i)).toBeInTheDocument();
  });

  it.each([
    ["light" as const, Paintbrush],
    ["dark" as const, Hammer],
  ])("should render FeatureCard content in %s tone", (tone, Icon) => {
    render(
      <FeatureCard
        body="Durable site-ready finishes."
        icon={Icon}
        title="Surface preparation"
        tone={tone}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /surface preparation/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/durable site-ready finishes/i)).toBeInTheDocument();
  });

  it("should render HighlightStat value and label", () => {
    render(<HighlightStat value="900+" label="completed projects" />);

    expect(screen.getByText("900+")).toBeInTheDocument();
    expect(screen.getByText(/completed projects/i)).toBeInTheDocument();
  });

  it.each([
    ["compact" as const],
    ["large" as const],
  ])("should render LogoMarquee images in %s size", (size) => {
    render(
      <LogoMarquee
        ariaLabel="Qualification logos"
        items={[
          { name: "Site Safe", src: "/site-safe.png" },
          { name: "Dulux", src: "/dulux.png" },
        ]}
        size={size}
      />,
    );

    expect(screen.getByLabelText(/qualification logos/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /site safe/i })).toHaveAttribute(
      "src",
      "/site-safe.png",
    );
    expect(screen.getByRole("img", { name: /dulux/i })).toHaveAttribute(
      "src",
      "/dulux.png",
    );
  });

  it("should render PersonCard initials and role", () => {
    render(
      <PersonCard
        focus="Coordinates quoting and practical project planning."
        name="Regan O'keefe"
        role="Sales Representative"
      />,
    );

    expect(screen.getByText("RO")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /regan o'keefe/i })).toBeInTheDocument();
    expect(screen.getByText(/sales representative/i)).toBeInTheDocument();
    expect(screen.getByText(/coordinates quoting/i)).toBeInTheDocument();
  });

  it("should render StaggeredImagePair primary and secondary images", () => {
    render(
      <StaggeredImagePair
        primary={{
          alt: "Exterior work in progress",
          height: 600,
          src: "/primary.jpg",
          width: 500,
        }}
        secondary={{
          alt: "Completed exterior finish",
          height: 600,
          src: "/secondary.jpg",
          width: 500,
        }}
      />,
    );

    expect(screen.getByRole("img", { name: /exterior work in progress/i })).toHaveAttribute(
      "src",
      "/primary.jpg",
    );
    expect(screen.getByRole("img", { name: /completed exterior finish/i })).toHaveAttribute(
      "src",
      "/secondary.jpg",
    );
  });

  it.each([
    ["light" as const],
    ["dark" as const],
  ])("should render StatementCard content in %s tone", (tone) => {
    render(
      <StatementCard
        body="Reliable finishing work with clear communication."
        eyebrow="Our mission"
        title="Professional care on every site."
        tone={tone}
      />,
    );

    expect(screen.getByText(/our mission/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /professional care on every site/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/reliable finishing work/i)).toBeInTheDocument();
  });

  it("should render SectionHeading without optional eyebrow or body", () => {
    render(<SectionHeading title="Simple heading" align="center" tone="dark" />);

    expect(screen.getByRole("heading", { name: /simple heading/i })).toBeInTheDocument();
    expect(screen.queryByText(/services/i)).not.toBeInTheDocument();
  });

  it("should render ReviewCard in light tone", () => {
    render(
      <ReviewCard
        body="Clear communication and a clean handover."
        date="Mar 2026"
        name="Bill"
        rating="100%"
        title="Tidy work"
        tone="light"
      />,
    );

    expect(screen.getByRole("heading", { name: /tidy work/i })).toBeInTheDocument();
    expect(screen.getByText(/clear communication/i)).toBeInTheDocument();
    expect(screen.getByText(/nocowboys · mar 2026/i)).toBeInTheDocument();
  });

  it.each([
    ["large" as const, "light" as const, "/assets/logo-large-light.png"],
    ["large" as const, "dark" as const, "/assets/logo-large-dark.png"],
    ["short" as const, "light" as const, "/assets/logo-short-light.png"],
    ["short" as const, "dark" as const, "/assets/logo-short-dark.png"],
  ])("should render %s BrandLogo in %s theme", (variant, theme, src) => {
    render(<BrandLogo variant={variant} theme={theme} alt="Company logo" />);

    expect(screen.getByRole("img", { name: /company logo/i })).toHaveAttribute(
      "src",
      src,
    );
  });
});
