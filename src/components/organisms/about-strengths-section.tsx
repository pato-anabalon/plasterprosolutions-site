import type { LucideIcon } from "lucide-react";
import { FeatureCard } from "@/components/molecules/feature-card";
import { SectionHeading } from "@/components/molecules/section-heading";

type SiteStrength = {
  body: string;
  icon: LucideIcon;
  title: string;
};

type AboutStrengthsSectionProps = {
  strengths: SiteStrength[];
};

export function AboutStrengthsSection({
  strengths,
}: AboutStrengthsSectionProps) {
  return (
    <section className="bg-charcoal py-20 text-white sm:py-28">
      <div className="site-shell">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <SectionHeading
            eyebrow="What we bring to every site"
            title="A trade team shaped around preparation, durability, and clear delivery."
            body="The work spans residential homes, commercial spaces, rental handovers, real estate make-ready projects, and active construction sites across Auckland."
            tone="dark"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {strengths.map((strength, index) => (
              <FeatureCard
                body={strength.body}
                delay={index * 0.04}
                icon={strength.icon}
                key={strength.title}
                title={strength.title}
                tone="dark"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
