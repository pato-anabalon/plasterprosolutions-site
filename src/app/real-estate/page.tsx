import Image from "next/image";
import type { Metadata } from "next";
import { CalendarClock, Camera, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { SectionHeading } from "@/components/molecules/section-heading";
import { InnerPageHero } from "@/components/templates/inner-page-hero";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Real Estate",
  description:
    "Fast plastering, painting, and presentation services for Auckland real estate agents and property managers.",
};

const benefits = [
  "Pre-listing repairs and finish improvements",
  "Plaster patching, gib stopping, and repainting",
  "Reliable scheduling for open homes and tenancy deadlines",
  "Cleaner presentation for photography, viewings, and handover",
];

const moments = [
  { title: "Before photography", icon: Camera },
  { title: "Before open homes", icon: CalendarClock },
  { title: "Before tenant handover", icon: KeyRound },
];

export default function RealEstatePage() {
  return (
    <>
      <InnerPageHero
        eyebrow="Real Estate"
        title="Property presentation support for agents and property managers."
        body="A focused landing page for teams who need homes, rentals, and listings to look sharp before photography, viewings, inspections, and tenant handover."
        imageSrc={siteConfig.projectGallery[2].image}
        imageAlt="Photo-ready exterior presentation for an Auckland residential property"
        meta="Pre-listing · rental · handover"
        pageNumber="04"
      />
      <section className="py-20 sm:py-28">
        <div className="site-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Make-ready work"
            title="Small surface issues can change the way a property feels."
            body="Cracks, patched walls, stained paint, and tired exterior details can distract buyers and tenants. The work is scoped around the listing date, access windows, and the visible issues that matter most."
          />

          <div className="grid gap-5">
            <div className="overflow-hidden rounded-lg bg-charcoal">
              <Image
                className="aspect-[16/10] w-full object-cover opacity-[0.92]"
                src={siteConfig.projectGallery[2].image}
                alt="Real estate make-ready plastering and painting"
                width={900}
                height={560}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {moments.map(({ title, icon: Icon }) => (
                <div className="surface-panel rounded-lg p-4" key={title}>
                  <Icon className="text-spicy-orange" size={22} aria-hidden="true" />
                  <p className="mt-3 text-sm font-black uppercase tracking-[0.12em] text-charcoal">
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="site-shell mt-12 grid gap-4 md:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              className="flex gap-4 rounded-lg border border-charcoal/10 bg-surface p-5"
              key={benefit}
            >
              <CheckCircle2 className="mt-1 shrink-0 text-spicy-orange" size={22} aria-hidden="true" />
              <p className="text-lg font-bold text-charcoal">{benefit}</p>
            </div>
          ))}
        </div>

        <div className="site-shell mt-12 overflow-hidden rounded-lg bg-charcoal-brown text-white">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="balanced text-3xl font-black">
                Book a site review before the listing date.
              </h2>
              <p className="pretty mt-4 max-w-2xl text-lg leading-8 text-white/72">
                Share the property address, target date, access notes, and visible issues. The team will respond through the main quote workflow.
              </p>
            </div>
            <Button href="/contact" variant="secondary">
              Book a Site Visit
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
