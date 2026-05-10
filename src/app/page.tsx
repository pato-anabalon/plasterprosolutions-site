import Image from "next/image";
import { ArrowRight, CheckCircle2, Hammer, HomeIcon, Paintbrush, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { MetricCard } from "@/components/molecules/metric-card";
import { HomeHero } from "@/components/organisms/home-hero";
import { SectionHeading } from "@/components/molecules/section-heading";
import { siteConfig } from "@/data/site";

const serviceIcons = [Hammer, HomeIcon, Paintbrush, Sparkles];

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
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {siteConfig.services.map((service, index) => {
              const Icon = serviceIcons[index] ?? CheckCircle2;

              return (
                <AnimatedReveal
                  className="group surface-panel rounded-lg p-6 transition duration-300 hover:-translate-y-1 hover:border-spicy-orange/50"
                  key={service.slug}
                  delay={index * 0.04}
                >
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <Icon className="text-spicy-orange" size={30} aria-hidden="true" />
                    <span className="text-sm font-black text-charcoal/28">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="balanced text-xl font-black text-charcoal">{service.title}</h3>
                  <p className="pretty mt-4 text-base leading-7 text-muted">{service.description}</p>
                  <a
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-charcoal transition group-hover:text-spicy-orange"
                    href={`/services#${service.slug}`}
                  >
                    Explore <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </AnimatedReveal>
              );
            })}
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
                className="group overflow-hidden rounded-lg bg-charcoal"
                key={project.title}
                delay={index * 0.04}
              >
                <div className="relative">
                  <Image
                    className="aspect-[4/5] h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                    src={project.image}
                    alt={project.title}
                    width={640}
                    height={800}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(25,23,20,0.88),transparent)] p-5 pt-16">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-spicy-orange">
                      {project.service}
                    </p>
                    <h3 className="mt-2 text-xl font-black text-white">{project.title}</h3>
                  </div>
                </div>
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
