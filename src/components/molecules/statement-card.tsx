import { CircleDot } from "lucide-react";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";

type StatementCardProps = {
  body: string;
  delay?: number;
  eyebrow: string;
  title: string;
  tone?: "dark" | "light";
};

export function StatementCard({
  body,
  delay = 0,
  eyebrow,
  title,
  tone = "light",
}: StatementCardProps) {
  const cardClasses =
    tone === "dark"
      ? "bg-charcoal text-white"
      : "border border-charcoal/10 bg-white text-charcoal shadow-[0_24px_70px_rgba(25,23,20,0.08)]";
  const bodyClasses = tone === "dark" ? "text-white/68" : "text-muted";

  return (
    <AnimatedReveal
      className={`relative overflow-hidden rounded-lg p-8 sm:p-10 ${cardClasses}`}
      delay={delay}
    >
      <CircleDot
        className="absolute right-7 top-7 text-spicy-orange"
        size={26}
        aria-hidden="true"
      />
      <p className="text-sm font-black uppercase tracking-[0.2em] text-spicy-orange">
        {eyebrow}
      </p>
      <h2 className="balanced mt-8 text-3xl font-black leading-tight sm:text-4xl">
        {title}
      </h2>
      <p className={`pretty mt-6 text-lg leading-8 ${bodyClasses}`}>{body}</p>
    </AnimatedReveal>
  );
}
