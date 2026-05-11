import Image from "next/image";
import type { Metadata } from "next";
import { Award, UsersRound } from "lucide-react";
import { SectionHeading } from "@/components/molecules/section-heading";
import { InnerPageHero } from "@/components/templates/inner-page-hero";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about PlasterProSolution, an Auckland plastering and painting team with more than 20 years of industry experience.",
};

export default function AboutPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="About"
        title="A practical, experienced crew focused on finish quality."
        body="Auckland plastering, painting, and gib stopping support for people who need steady communication, clean preparation, and a finish that holds up in person and on camera."
        imageSrc={siteConfig.projectGallery[4].image}
        imageAlt="Premium residential exterior coating work by PlasterPro Solution"
        meta="20+ years industry experience"
        pageNumber="03"
      />
      <section className="py-20 sm:py-28">
        <div className="site-shell grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Team"
              title="Led by hands-on trade experience and built for active Auckland sites."
              body="PlasterProSolution supports homeowners, builders, commercial teams, agents, and property managers with reliable communication and detailed finishing work."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {["Rolando", "Regan", "Javier"].map((member) => (
                <div className="surface-panel rounded-lg p-6" key={member}>
                  <p className="text-2xl font-black text-charcoal">{member}</p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-muted">
                    Core team
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex gap-4 border-t border-charcoal/10 pt-5">
                <UsersRound
                  className="mt-1 shrink-0 text-spicy-orange"
                  size={24}
                  aria-hidden="true"
                />
                <p className="pretty text-lg font-bold leading-8 text-charcoal">
                  Structured for homeowners and trade partners who need the same
                  thing: fewer surprises on site.
                </p>
              </div>
              <div className="flex gap-4 border-t border-charcoal/10 pt-5">
                <Award
                  className="mt-1 shrink-0 text-spicy-orange"
                  size={24}
                  aria-hidden="true"
                />
                <p className="pretty text-lg font-bold leading-8 text-charcoal">
                  Certification, product familiarity, and repeatable preparation
                  help keep finish quality consistent.
                </p>
              </div>
            </div>
          </div>

          <div className="surface-panel rounded-lg p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-spicy-orange">
              Qualifications and partners
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {siteConfig.qualifications.slice(0, 4).map((item) => (
                <div
                  className="grid min-h-28 place-items-center rounded-md bg-white p-4"
                  key={item.name}
                >
                  <Image
                    src={item.src}
                    alt={item.name}
                    width={150}
                    height={70}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
