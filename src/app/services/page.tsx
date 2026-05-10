import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { InnerPageHero } from "@/components/templates/inner-page-hero";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Commercial plastering, residential plastering, painting, and gib stopping services across Auckland.",
};

export default function ServicesPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="Services"
        title="Plastering and painting services built for Auckland properties."
        body="A practical service structure for commercial teams, homeowners, agents, and property managers who need dependable preparation and clean finishes."
      />
      <section className="py-20 sm:py-28">
        <div className="site-shell grid gap-6 md:grid-cols-2">
          {siteConfig.services.map((service, index) => (
            <AnimatedReveal
              className="surface-panel grid content-between rounded-lg p-7 sm:p-8"
              id={service.slug}
              key={service.slug}
              delay={(index % 2) * 0.05}
            >
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-spicy-orange">
                  {String(index + 1).padStart(2, "0")} / PlasterProSolutions
                </p>
                <h2 className="balanced mt-4 text-3xl font-black text-charcoal">{service.title}</h2>
                <p className="pretty mt-5 text-lg leading-8 text-muted">{service.description}</p>
                <p className="mt-6 border-l-2 border-spicy-orange pl-4 text-base font-bold leading-7 text-charcoal">
                  {service.bestFor}
                </p>
                <ul className="mt-6 grid gap-3">
                  {service.includes.map((item) => (
                    <li className="flex gap-3 text-base font-bold text-muted" key={item}>
                      <CheckCircle2 className="mt-0.5 shrink-0 text-oxide-green" size={18} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="mt-8 w-full sm:w-fit" href="/contact">
                Request This Service
              </Button>
            </AnimatedReveal>
          ))}
        </div>
      </section>
    </>
  );
}
