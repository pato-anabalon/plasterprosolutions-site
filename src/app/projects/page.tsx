import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { InnerPageHero } from "@/components/templates/inner-page-hero";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Recent plastering and painting project work from PlasterProSolution across Auckland.",
};

export default function ProjectsPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="Projects"
        title="Auckland plastering and painting work with finish detail in focus."
        body="A curated gallery of surface preparation, plastering, painting, and property presentation work across residential, commercial, and real estate timelines."
        imageSrc={siteConfig.projectGallery[0].image}
        imageAlt="Finished exterior plastering on an Auckland residential property"
        meta="Recent work across Auckland"
        pageNumber="02"
      />
      <section className="py-20 sm:py-28">
        <div className="site-shell grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.projectGallery.map((project, index) => (
            <AnimatedReveal
              className={
                index === 0
                  ? "overflow-hidden rounded-lg bg-charcoal text-white sm:col-span-2"
                  : "surface-panel overflow-hidden rounded-lg"
              }
              key={project.title}
              delay={(index % 4) * 0.04}
            >
              <Image
                className={
                  index === 0
                    ? "aspect-[16/9] w-full object-cover opacity-90"
                    : "aspect-[4/3] w-full object-cover"
                }
                src={project.image}
                alt={project.title}
                width={720}
                height={540}
              />
              <div className="p-5">
                <p
                  className={
                    index === 0
                      ? "text-xs font-black uppercase tracking-[0.16em] text-spicy-orange"
                      : "text-xs font-black uppercase tracking-[0.16em] text-spicy-orange"
                  }
                >
                  {project.service}
                </p>
                <h2
                  className={
                    index === 0
                      ? "mt-3 text-3xl font-black"
                      : "mt-3 text-xl font-black text-charcoal"
                  }
                >
                  {project.title}
                </h2>
                <p
                  className={
                    index === 0
                      ? "mt-2 text-sm font-bold uppercase tracking-[0.14em] text-white/62"
                      : "mt-2 text-sm font-bold uppercase tracking-[0.14em] text-muted"
                  }
                >
                  {project.location}
                </p>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </section>
    </>
  );
}
