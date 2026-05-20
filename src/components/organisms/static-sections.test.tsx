import { Hammer, UsersRound } from "lucide-react";
import { AboutMissionVision } from "@/components/organisms/about-mission-vision";
import { AboutProofStrip } from "@/components/organisms/about-proof-strip";
import { AboutQualificationsSection } from "@/components/organisms/about-qualifications-section";
import { AboutStorySection } from "@/components/organisms/about-story-section";
import { AboutStrengthsSection } from "@/components/organisms/about-strengths-section";
import { AboutTeamSection } from "@/components/organisms/about-team-section";
import { CustomerReviewsSection } from "@/components/organisms/customer-reviews-section";
import { Footer } from "@/components/organisms/footer";
import { HomeHero } from "@/components/organisms/home-hero";
import { ProjectMosaicGallery } from "@/components/organisms/project-mosaic-gallery";
import { QualificationsCarousel } from "@/components/organisms/qualifications-carousel";
import { SitePreloader } from "@/components/organisms/site-preloader";
import { siteConfig } from "@/data/site";
import { teamMembers } from "@/data/team";
import { render, screen } from "@/test/test-utils";
import { act } from "@testing-library/react";

const qualifications = [
  { name: "Site Safe", src: "/site-safe.png" },
  { name: "Dulux", src: "/dulux.png" },
];

const galleryPhotos = [
  {
    category: "Interior finish",
    image: "/freemans-bay.jpg",
    layout: "featured" as const,
    location: "Freemans Bay",
    title: "Freemans Bay interior prep",
  },
  {
    category: "Exterior plastering",
    image: "/whitford.jpg",
    layout: "wide" as const,
    location: "Whitford",
    title: "Whitford exterior system",
  },
];

describe("static site sections", () => {
  it("should render AboutMissionVision mission and vision statements", () => {
    render(<AboutMissionVision />);

    expect(screen.getByText(/our mission/i)).toBeInTheDocument();
    expect(screen.getByText(/our vision/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /high-quality finishes/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /recognised for excellence/i })).toBeInTheDocument();
  });

  it("should render AboutProofStrip proof points", () => {
    render(
      <AboutProofStrip
        proofPoints={[
          { label: "completed projects", value: "900+" },
          { label: "years of experience", value: "20+" },
        ]}
      />,
    );

    expect(screen.getByText("900+")).toBeInTheDocument();
    expect(screen.getByText(/completed projects/i)).toBeInTheDocument();
    expect(screen.getByText("20+")).toBeInTheDocument();
  });

  it("should render AboutQualificationsSection with marquee logos", () => {
    render(<AboutQualificationsSection qualifications={qualifications} />);

    expect(
      screen.getByRole("heading", { name: /recognised systems/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /site safe/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /dulux/i })).toBeInTheDocument();
  });

  it("should render AboutStorySection values and images", () => {
    render(<AboutStorySection />);

    expect(
      screen.getByRole("heading", { name: /the finish matters/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/professional and reliable service/i)).toBeInTheDocument();
    expect(screen.getByText(/customer-focused project delivery/i)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /completed exterior plastering project/i }),
    ).toHaveAttribute("src", "/assets/about-second-section-2.jpeg");
  });

  it("should render AboutStrengthsSection cards", () => {
    render(
      <AboutStrengthsSection
        strengths={[
          {
            body: "Preparation-first workmanship.",
            icon: Hammer,
            title: "Strong preparation",
          },
          {
            body: "Clear coordination with clients.",
            icon: UsersRound,
            title: "Practical communication",
          },
        ]}
      />,
    );

    expect(screen.getByText(/what we bring to every site/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /strong preparation/i })).toBeInTheDocument();
    expect(screen.getByText(/clear coordination/i)).toBeInTheDocument();
  });

  it("should render AboutTeamSection member cards", () => {
    render(<AboutTeamSection members={teamMembers.slice(0, 2)} />);

    expect(screen.getByText(/the team behind the finish/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: teamMembers[0].name })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: teamMembers[1].name })).toBeInTheDocument();
  });

  it.each([
    ["dark" as const],
    ["light" as const],
  ])("should render CustomerReviewsSection in %s tone", (tone) => {
    render(<CustomerReviewsSection tone={tone} />);

    expect(screen.getByRole("heading", { name: /proof from auckland properties/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view nocowboys authenticated ratings/i })).toHaveAttribute(
      "href",
      siteConfig.reviewSource.href,
    );
    expect(
      screen.getByRole("heading", { name: siteConfig.customerReviews[0].title }),
    ).toBeInTheDocument();
  });

  it("should render Footer contact and navigation links", () => {
    render(<Footer />);

    expect(screen.getByText(/auckland plastering, painting/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: siteConfig.email })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.email}`,
    );
    expect(screen.getByRole("navigation", { name: /footer navigation/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /terms of service/i })).toHaveAttribute(
      "href",
      "/terms-of-service",
    );
  });

  it("should render HomeHero headline and primary links", () => {
    render(<HomeHero />);

    expect(
      screen.getByRole("heading", { name: /premium finishes for auckland properties/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /work explore recent finishes/i })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByRole("link", { name: /request a quote tell us about your idea/i })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByText(/scroll to explore/i)).toBeInTheDocument();
  });

  it("should render ProjectMosaicGallery heading and image buttons", () => {
    render(<ProjectMosaicGallery photos={galleryPhotos} />);

    expect(screen.getByRole("heading", { name: /a living archive/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open project image: freemans bay interior prep/i }),
    ).toBeInTheDocument();
  });

  it("should render QualificationsCarousel heading and logos", () => {
    render(<QualificationsCarousel qualifications={qualifications} />);

    expect(
      screen.getByRole("heading", { name: /qualified crews/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /site safe/i })).toBeInTheDocument();
  });

  it("should hide SitePreloader after the fallback timeout", () => {
    jest.useFakeTimers();

    render(<SitePreloader />);

    expect(
      screen.getByRole("status", { name: /loading plasterprosolution/i }),
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3600);
    });

    expect(
      screen.queryByRole("status", { name: /loading plasterprosolution/i }),
    ).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});
