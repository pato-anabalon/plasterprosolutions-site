import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { LogoMarquee } from "@/components/molecules/logo-marquee";
import { SectionHeading } from "@/components/molecules/section-heading";

type Qualification = {
  name: string;
  src: string;
};

type AboutQualificationsSectionProps = {
  qualifications: Qualification[];
};

export function AboutQualificationsSection({
  qualifications,
}: AboutQualificationsSectionProps) {
  return (
    <section
      className="overflow-hidden bg-[linear-gradient(180deg,#191714_0%,#24211d_100%)] py-20 text-white sm:py-24"
      data-testid="about-qualifications-section"
    >
      <div className="site-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center" data-testid="about-qualifications-section-layout">
        <AnimatedReveal data-testid="about-qualifications-section-heading">
          <SectionHeading
            eyebrow="Qualifications and partners"
            title="Recognised systems, trusted suppliers, proven standards."
            body="The team works with trade credentials and product partners that support stronger, cleaner, and longer-lasting Auckland finishes."
            tone="dark"
          />
        </AnimatedReveal>

        <AnimatedReveal className="lg:pl-6" data-testid="about-qualifications-section-marquee" delay={0.08}>
          <div className="border-y border-white/10 py-5" data-testid="about-qualifications-section-marquee-frame">
            <LogoMarquee
              ariaLabel="PlasterPro Solution qualifications and supplier logos"
              items={qualifications}
              size="large"
            />
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
}
