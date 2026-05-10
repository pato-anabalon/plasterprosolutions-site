import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { MetricCard } from "@/components/molecules/metric-card";
import { HomeHero } from "@/components/organisms/home-hero";
import { SectionHeading } from "@/components/molecules/section-heading";
import { siteConfig } from "@/data/site";

export default function Home() {
  return (
    <>
      <HomeHero />

      <section className="bg-charcoal-brown pb-10 pt-10">
        <div className="site-shell grid gap-4 sm:grid-cols-3">
          {siteConfig.metrics.map((metric) => (
            <MetricCard key={metric.label} value={metric.value} label={metric.label} />
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
                <p className="flex items-center gap-3 text-lg font-black text-charcoal" key={pillar}>
                  <ShieldCheck className="text-oxide-green" size={20} aria-hidden="true" />
                  {pillar}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-12 grid overflow-hidden rounded-lg border border-charcoal/10 bg-charcoal/10 md:grid-cols-2 lg:grid-cols-4">
            {siteConfig.services.map((service, index) => (
              <AnimatedReveal
                className="service-card group relative min-h-[25rem] overflow-hidden bg-surface transition duration-500 hover:z-10 hover:-translate-y-1 hover:bg-charcoal focus-within:z-10 focus-within:-translate-y-1 focus-within:bg-charcoal"
                key={service.slug}
                delay={index * 0.04}
              >
                <Link
                  className="focus-ring relative flex h-full min-h-[25rem] flex-col justify-between p-6 text-charcoal transition duration-500 group-hover:text-white group-focus-within:text-white"
                  href={`/services#${service.slug}`}
                  aria-label={`Explore ${service.title}`}
                >
                  <span
                    className="pointer-events-none absolute -right-3 top-4 text-[6.5rem] font-black leading-none text-charcoal/[0.06] transition duration-500 group-hover:text-white/10 group-focus-within:text-white/10 sm:text-[7.5rem] lg:text-[6.5rem] xl:text-[7.25rem]"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="relative z-10 flex items-center justify-between gap-4">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-spicy-orange">
                      Service
                    </span>
                    <ArrowRight
                      className="text-charcoal/30 transition duration-300 group-hover:translate-x-1 group-hover:text-spicy-orange group-focus-within:translate-x-1 group-focus-within:text-spicy-orange"
                      size={20}
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="balanced relative z-30 mt-auto max-w-[13rem] text-2xl font-black leading-tight transition duration-700 ease-out group-hover:-translate-y-44 group-hover:text-white group-focus-within:-translate-y-44 group-focus-within:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                    {service.title}
                  </h3>
                  <span className="absolute inset-x-0 bottom-0 z-20 translate-y-full border-t border-white/10 bg-charcoal p-6 text-white transition duration-700 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0">
                    <span className="block h-28 overflow-hidden">
                      <span className="service-card-copy-track block">
                        <span className="pretty block h-28 text-base leading-7 text-white/76">
                          {service.description}
                        </span>
                        <span className="pretty block h-28 text-base leading-7 text-white/76">
                          <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-spicy-orange">
                            Best for
                          </span>
                          {service.bestFor}
                        </span>
                        <span className="pretty block h-28 text-base leading-7 text-white/76">
                          <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-spicy-orange">
                            Includes
                          </span>
                          {service.includes.slice(0, 2).join(" / ")}
                        </span>
                      </span>
                    </span>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-spicy-orange">
                      Explore service <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
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
                  <article className="relative min-h-[25rem] overflow-hidden rounded-lg bg-charcoal shadow-[0_18px_54px_rgba(25,23,20,0.16)]">
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

      <section className="bg-charcoal-brown py-16 text-white">
        <div className="site-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-white/60">
              Ready to talk scope?
            </p>
            <h2 className="balanced mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Send the job details and the team will come back with next steps.
            </h2>
          </div>
          <Button href="/contact" variant="secondary">
            Contact the Team
          </Button>
        </div>
      </section>
    </>
  );
}
