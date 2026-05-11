import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { MetricCard } from "@/components/molecules/metric-card";
import { HomeServiceCards } from "@/components/organisms/home-service-cards";
import { HomeHero } from "@/components/organisms/home-hero";
import { QualificationsCarousel } from "@/components/organisms/qualifications-carousel";
import { SectionHeading } from "@/components/molecules/section-heading";
import { siteConfig } from "@/data/site";

export default function Home() {
  return (
    <>
      <HomeHero />

      <section className="bg-charcoal-brown pb-10 pt-10">
        <div className="site-shell grid gap-4 sm:grid-cols-3">
          {siteConfig.metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              value={metric.value}
              label={metric.label}
            />
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="site-shell">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_0.55fr] lg:items-end">
            <SectionHeading
              eyebrow="Services"
              title="A complete finishing crew for high-expectation properties."
              body="From commercial scopes to tight real estate turnarounds, the work is planned around clean preparation, reliable communication, and a finish that photographs beautifully."
            />
            <div className="grid gap-3 border-l-2 border-spicy-orange pl-5">
              {siteConfig.trustPillars.map((pillar) => (
                <p
                  className="flex items-center gap-3 text-lg font-black text-charcoal"
                  key={pillar}
                >
                  <ShieldCheck
                    className="text-oxide-green"
                    size={20}
                    aria-hidden="true"
                  />
                  {pillar}
                </p>
              ))}
            </div>
          </div>
          <HomeServiceCards services={siteConfig.services} />
        </div>
      </section>

      <section className="bg-charcoal py-20 text-white sm:py-28">
        <div className="site-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <AnimatedReveal>
            <SectionHeading
              eyebrow="Process"
              title="Built around preparation, control, and a clean handover."
              body="The site experience matters as much as the surface. Every stage is structured so builders, owners, agents, and property managers know what is happening next."
              tone="dark"
            />
          </AnimatedReveal>
          <div className="grid gap-4">
            {siteConfig.process.map((step, index) => (
              <AnimatedReveal
                className="flex items-center gap-5 border-b border-white/12 py-5 transition hover:border-spicy-orange/50"
                key={step}
                delay={index * 0.05}
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-spicy-orange text-sm font-black">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-2xl font-black">{step}</p>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="site-shell">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Projects"
              title="Recent finishes from active Auckland sites."
              body="Selected surface repairs, plaster finishes, paint preparation, and presentation work from Auckland properties."
            />
            <Button href="/projects" variant="secondary">
              Open Gallery
            </Button>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {siteConfig.projectGallery.slice(0, 4).map((project, index) => (
              <AnimatedReveal
                className="group"
                key={project.title}
                delay={index * 0.04}
              >
                <Link
                  className="focus-ring block"
                  href="/projects"
                  aria-label={`View project: ${project.title}`}
                >
                  <article className="relative min-h-[29rem] overflow-hidden rounded-lg bg-charcoal shadow-[0_18px_54px_rgba(25,23,20,0.16)]">
                    <Image
                      className="object-cover opacity-[0.92] transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100 group-focus-within:scale-105 group-focus-within:opacity-100"
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,23,20,0.02)_0%,rgba(25,23,20,0.1)_34%,rgba(25,23,20,0.78)_66%,rgba(65,63,61,0.96)_100%)] transition duration-500 group-hover:bg-[linear-gradient(180deg,rgba(25,23,20,0.02)_0%,rgba(25,23,20,0.08)_28%,rgba(25,23,20,0.72)_60%,rgba(65,63,61,0.98)_100%)] group-focus-within:bg-[linear-gradient(180deg,rgba(25,23,20,0.02)_0%,rgba(25,23,20,0.08)_28%,rgba(25,23,20,0.72)_60%,rgba(65,63,61,0.98)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                      <div className="translate-y-1 transition duration-500 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-spicy-orange">
                          {project.service}
                        </p>
                        <h3 className="balanced mt-3 text-3xl font-black leading-[0.98] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.36)] lg:text-2xl xl:text-3xl">
                          {project.title}
                        </h3>
                        <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/18 pt-4">
                          <p className="max-w-[11rem] text-sm font-bold leading-5 text-white/74">
                            {project.location}
                          </p>
                          <span className="grid size-10 shrink-0 place-items-center rounded-md border border-white/16 bg-white/10 text-sm font-black text-white backdrop-blur transition duration-300 group-hover:border-spicy-orange/60 group-hover:bg-spicy-orange group-focus-within:border-spicy-orange/60 group-focus-within:bg-spicy-orange">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      <QualificationsCarousel qualifications={siteConfig.qualifications} />

      <section className="bg-spicy-orange py-16 text-white">
        <div className="site-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-white/72">
              Ready to talk scope?
            </p>
            <h2 className="balanced mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Send the job details and the team will come back with next steps.
            </h2>
          </div>
          <Button href="/contact" variant="dark">
            Contact the Team
          </Button>
        </div>
      </section>
    </>
  );
}
