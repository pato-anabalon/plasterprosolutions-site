import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { HighlightStat } from "@/components/molecules/highlight-stat";

type ProofPoint = {
  label: string;
  value: string;
};

type AboutProofStripProps = {
  proofPoints: ProofPoint[];
};

export function AboutProofStrip({ proofPoints }: AboutProofStripProps) {
  return (
    <section
      className="border-b border-charcoal/10 bg-surface py-8"
      data-testid="about-proof-strip"
    >
      <div className="site-shell grid gap-4 sm:grid-cols-3" data-testid="about-proof-strip-grid">
        {proofPoints.map((point, index) => (
          <AnimatedReveal
            data-testid="about-proof-strip-item"
            delay={index * 0.04}
            key={point.label}
          >
            <HighlightStat label={point.label} value={point.value} />
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
}
