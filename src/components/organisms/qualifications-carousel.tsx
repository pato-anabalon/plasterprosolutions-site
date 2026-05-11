import Image from "next/image";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";

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
          <div className="qualifications-marquee group relative -my-8 py-8">
            <div
              className="qualifications-marquee-track flex w-max items-center"
              aria-label="PlasterPro Solution qualifications and supplier logos"
            >
              {[0, 1].map((setIndex) => (
                <div
                  className="qualifications-marquee-set flex items-center gap-6 pr-6"
                  key={setIndex}
                  aria-hidden={setIndex === 1}
                >
                  {qualifications.map((qualification) => (
                    <div
                      className="qualification-logo-card group/card relative grid size-28 shrink-0 place-items-center overflow-hidden rounded-md border border-white/12 bg-white shadow-[0_18px_48px_rgba(0,0,0,0.18)] transition-colors duration-300 sm:size-36"
                      key={`${qualification.name}-${setIndex}`}
                      title={qualification.name}
                    >
                      <Image
                        className="object-cover opacity-70 grayscale transition duration-500 ease-out group-hover/card:scale-105 group-hover/card:opacity-100 group-hover/card:grayscale-0"
                        src={qualification.src}
                        alt={setIndex === 0 ? qualification.name : ""}
                        fill
                        sizes="(max-width: 640px) 7rem, 9rem"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedReveal>
    </section>
  );
}
