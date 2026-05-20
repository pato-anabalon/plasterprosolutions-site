import type { Metadata } from "next";
import { ContactDetails } from "@/components/organisms/contact-details";
import { QuoteRequestForm } from "@/components/organisms/quote-request-form";
import { InnerPageHero } from "@/components/templates/inner-page-hero";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a plastering, painting, gib stopping, or real estate property presentation quote from PlasterProSolution.",
};

export default function ContactPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="Contact"
        title="Tell us about the property, timeline, and finish you need."
        body="Share the key details and our team will review your request, check the scope, and get back to you with clear next steps."
        imageSrc={siteConfig.projectGallery[6].image}
        imageAlt="Freemans Bay interior plastering and painting finish"
        meta="Fast scoping and clear next steps"
        pageNumber="05"
      />
      <section className="py-20 sm:py-28">
        <div className="site-shell grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <ContactDetails />
          <QuoteRequestForm />
        </div>
      </section>
    </>
  );
}
