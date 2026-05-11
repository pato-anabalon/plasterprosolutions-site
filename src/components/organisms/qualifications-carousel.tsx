import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { LogoMarquee } from "@/components/molecules/logo-marquee";

type Qualification = {
  name: string;
  src: string;
};

type QualificationsCarouselProps = {
  qualifications: Qualification[];
};

export function QualificationsCarousel({
  qualifications,
}: QualificationsCarouselProps) {
  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,#191714_0%,#24211d_100%)] py-14 text-white sm:py-16">
      <div className="site-shell">
        <AnimatedReveal className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-spicy-orange">
            Qualifications & Partners
          </p>
          <h2 className="balanced mx-auto mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Qualified crews. Trusted systems. Proven suppliers.
          </h2>
          <p className="pretty mx-auto mt-5 max-w-2xl text-base font-bold leading-7 text-white/64 sm:text-lg">
            Trade credentials and product partners behind durable Auckland
            finishes.
          </p>
        </AnimatedReveal>
      </div>

      <AnimatedReveal className="site-shell mt-10" delay={0.08}>
        <div className="mx-auto max-w-[55.5rem] border-y border-white/10 py-5">
          <LogoMarquee
            ariaLabel="PlasterPro Solution qualifications and supplier logos"
            items={qualifications}
          />
        </div>
      </AnimatedReveal>
    </section>
  );
}
