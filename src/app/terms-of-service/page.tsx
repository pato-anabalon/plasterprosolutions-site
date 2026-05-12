import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LegalDocumentSection } from "@/components/molecules/legal-document-section";
import { termsOfService } from "@/data/terms";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for goods and services supplied by PlasterPro Solution Ltd.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <section className="bg-charcoal px-4 pb-16 pt-32 text-white sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-spicy-orange">
            Legal
          </p>
          <h1 className="balanced mt-5 max-w-4xl text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">
            {termsOfService.title}
          </h1>
          <p className="pretty mt-6 max-w-2xl text-lg font-bold leading-8 text-white/70">
            {termsOfService.description}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="site-shell grid gap-8 lg:grid-cols-[18rem_1fr] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            <div className="rounded-lg border border-charcoal/10 bg-surface p-5 shadow-[0_16px_44px_rgb(25_23_20/0.06)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-spicy-orange">
                Contents
              </p>
              <nav className="mt-4 grid gap-2" aria-label="Terms sections">
                {termsOfService.sections.map((section) => (
                  <Link
                    className="group flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-extrabold text-charcoal transition hover:bg-spicy-orange hover:text-white"
                    href={`#${section.id}`}
                    key={section.id}
                  >
                    <span>{section.title}</span>
                    <ArrowUpRight
                      className="text-spicy-orange transition group-hover:text-white"
                      size={16}
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <div className="grid gap-8">
            {termsOfService.sections.map((section) => (
              <LegalDocumentSection
                content={section.content}
                id={section.id}
                key={section.id}
                title={section.title}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
