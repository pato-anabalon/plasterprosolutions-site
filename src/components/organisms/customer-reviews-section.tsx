import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { ReviewCard } from "@/components/molecules/review-card";
import { SectionHeading } from "@/components/molecules/section-heading";
import { siteConfig } from "@/data/site";

type CustomerReviewsSectionProps = {
  className?: string;
  tone?: "dark" | "light";
};

export function CustomerReviewsSection({
  className = "",
  tone = "dark",
}: CustomerReviewsSectionProps) {
  const isDark = tone === "dark";
  const sectionClasses = isDark
    ? "bg-charcoal text-white"
    : "bg-surface-strong text-charcoal";
  const sourceCardClasses = isDark
    ? "border-white/12 bg-white/[0.055] hover:border-spicy-orange/70 hover:bg-white/[0.075]"
    : "border-charcoal/10 bg-surface shadow-[0_22px_70px_rgb(25_23_20/0.08)] hover:border-spicy-orange/60";
  const scoreClasses = isDark ? "text-white" : "text-charcoal";
  const sourceMetaClasses = isDark ? "text-white/58" : "text-muted";

  return (
    <section
      className={`py-20 sm:py-28 ${sectionClasses} ${className}`}
      data-testid="customer-reviews-section"
    >
      <div className="site-shell">
        <div
          className="grid gap-8 lg:grid-cols-[0.8fr_0.6fr] lg:items-end"
          data-testid="customer-reviews-section-header"
        >
          <AnimatedReveal data-testid="customer-reviews-section-heading">
            <SectionHeading
              eyebrow="Customer reviews"
              title="Proof from Auckland properties, not just promises."
              body="See why Auckland clients trust PlasterPro Solution for clear communication, tidy sites, and finishes that are ready for handover, sale, or everyday use."
              tone={tone}
            />
          </AnimatedReveal>

          <AnimatedReveal data-testid="customer-reviews-section-source" delay={0.05}>
            <a
              className={`group ml-auto grid max-w-sm gap-5 rounded-lg border p-5 transition duration-300 hover:-translate-y-1 ${sourceCardClasses}`}
              data-testid="customer-reviews-source-card"
              href={siteConfig.reviewSource.href}
              rel="noreferrer noopener"
              target="_blank"
            >
              <span className="flex items-center justify-between gap-5">
                <span className="grid size-16 shrink-0 place-items-center rounded-md bg-white p-2 shadow-[0_14px_36px_rgb(0_0_0/0.18)] transition duration-300 group-hover:scale-105">
                  <Image
                    alt="NoCowboys"
                    className="object-contain"
                    height={56}
                    src={siteConfig.reviewSource.logo}
                    width={56}
                    data-testid="customer-reviews-source-logo"
                  />
                </span>
                <ArrowUpRight
                  className="shrink-0 text-spicy-orange transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  size={28}
                  aria-hidden="true"
                />
              </span>
              <span>
                <span
                  className={`block text-5xl font-black leading-none sm:text-6xl ${scoreClasses}`}
                >
                  {siteConfig.reviewSource.approval}
                </span>
                <span
                  className={`mt-2 block text-sm font-extrabold uppercase tracking-[0.16em] ${sourceMetaClasses}`}
                >
                  Approval from {siteConfig.reviewSource.count} ratings
                </span>
              </span>
              <span className="sr-only">
                View {siteConfig.reviewSource.label}
              </span>
            </a>
          </AnimatedReveal>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3" data-testid="customer-reviews-grid">
          {siteConfig.customerReviews.map((review, index) => (
            <AnimatedReveal data-testid="customer-reviews-item" key={review.title} delay={index * 0.05}>
              <ReviewCard {...review} tone={tone} />
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
