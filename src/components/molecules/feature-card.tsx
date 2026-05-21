import type { LucideIcon } from "lucide-react";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";

type FeatureCardProps = {
  body: string;
  delay?: number;
  icon: LucideIcon;
  title: string;
  tone?: "dark" | "light";
};

export function FeatureCard({
  body,
  delay = 0,
  icon: Icon,
  title,
  tone = "light",
}: FeatureCardProps) {
  const cardClasses =
    tone === "dark"
      ? "border-white/12 bg-white/[0.045] text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      : "border-charcoal/10 bg-surface text-charcoal shadow-[0_18px_50px_rgba(25,23,20,0.06)]";
  const bodyClasses = tone === "dark" ? "text-white/64" : "text-muted";

  return (
    <AnimatedReveal
      className={`rounded-lg border p-6 ${cardClasses}`}
      data-testid="feature-card"
      delay={delay}
    >
      <Icon className="text-spicy-orange" size={24} aria-hidden="true" />
      <h3
        className="balanced mt-5 text-2xl font-black leading-tight"
        data-testid="feature-card-title"
      >
        {title}
      </h3>
      <p className={`pretty mt-4 text-base font-bold leading-7 ${bodyClasses}`}>
        {body}
      </p>
    </AnimatedReveal>
  );
}
