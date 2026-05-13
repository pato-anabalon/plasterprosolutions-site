import { BrandLogo } from "@/components/atoms/brand-logo";
import { Button } from "@/components/atoms/button";
import { SocialIconLink } from "@/components/atoms/social-icon-link";
import { ContactPersonCard } from "@/components/molecules/contact-person-card";
import { LegalDocumentSection } from "@/components/molecules/legal-document-section";
import { MetricCard } from "@/components/molecules/metric-card";
import { ReviewCard } from "@/components/molecules/review-card";
import { SectionHeading } from "@/components/molecules/section-heading";
import { ContactDetails } from "@/components/organisms/contact-details";
import { InnerPageHero } from "@/components/templates/inner-page-hero";
import { siteConfig } from "@/data/site";
import { render, screen } from "@/test/test-utils";

describe("presentational components", () => {
  it("should render Button as a link when href is provided", () => {
    render(<Button href="/contact">Request a Quote</Button>);

    expect(screen.getByRole("link", { name: /request a quote/i })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("should render BrandLogo with accessible light logo text", () => {
    render(<BrandLogo />);

    expect(
      screen.getByRole("img", { name: /plasterpro solution/i }),
    ).toBeInTheDocument();
  });

  it("should render SocialIconLink as an external link", () => {
    render(<SocialIconLink href="https://example.com" label="Facebook" />);

    const link = screen.getByRole("link", { name: /open facebook/i });

    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("should render SectionHeading content", () => {
    render(
      <SectionHeading
        eyebrow="Services"
        title="Premium finishes"
        body="Sharp plastering and painting."
      />,
    );

    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /premium finishes/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/sharp plastering and painting/i)).toBeInTheDocument();
  });

  it("should render ContactPersonCard phone and email links", () => {
    render(
      <ContactPersonCard
        email="rolando@plasterprosolution.co.nz"
        name="Rolando Reveco"
        phone="021 742 300"
        role="Managing Director"
      />,
    );

    expect(screen.getByRole("heading", { name: /rolando reveco/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /021 742 300/i })).toHaveAttribute(
      "href",
      "tel:021742300",
    );
    expect(
      screen.getByRole("link", { name: /rolando@plasterprosolution.co.nz/i }),
    ).toHaveAttribute("href", "mailto:rolando@plasterprosolution.co.nz");
  });

  it("should render LegalDocumentSection title and content", () => {
    render(
      <LegalDocumentSection
        content={"First term\nSecond term"}
        id="terms"
        title="Terms of Service"
      />,
    );

    expect(
      screen.getByRole("heading", { name: /terms of service/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/first term/i)).toBeInTheDocument();
  });

  it("should render ReviewCard review details", () => {
    render(
      <ReviewCard
        body="The crew was tidy and clear."
        date="Jan 2026"
        name="Nicholas"
        rating="100%"
        title="Quality work"
      />,
    );

    expect(screen.getByRole("heading", { name: /quality work/i })).toBeInTheDocument();
    expect(screen.getByText(/the crew was tidy and clear/i)).toBeInTheDocument();
    expect(screen.getByText(/nocowboys · jan 2026/i)).toBeInTheDocument();
  });

  it("should render MetricCard value suffix and label", () => {
    render(<MetricCard value="900+" label="projects completed since 2021" />);

    expect(screen.getByText("0+")).toBeInTheDocument();
    expect(screen.getByText(/projects completed since 2021/i)).toBeInTheDocument();
  });

  it("should render ContactDetails from site config", () => {
    render(<ContactDetails />);

    expect(
      screen.getByRole("heading", { name: /contact details/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: siteConfig.phone })[0]).toHaveAttribute(
      "href",
      `tel:${siteConfig.phone.replaceAll(" ", "")}`,
    );
    expect(screen.getByRole("link", { name: siteConfig.email })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.email}`,
    );
  });

  it("should render InnerPageHero with CTA and optional image", () => {
    render(
      <InnerPageHero
        body="We deliver reliable Auckland finishing work."
        eyebrow="Services"
        imageAlt="Finished plastering"
        imageSrc="/hero.jpg"
        title="Premium plastering"
      />,
    );

    expect(
      screen.getByRole("heading", { name: /premium plastering/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /request a quote/i })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("img", { name: /finished plastering/i })).toHaveAttribute(
      "src",
      "/hero.jpg",
    );
  });
});
