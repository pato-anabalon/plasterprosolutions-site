import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, Mail, Search, Wrench } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/data/site";

const helpfulLinks = [
  {
    description: "Browse plastering, painting, gib stopping, and make-ready work.",
    href: "/services",
    icon: Wrench,
    label: "Services",
  },
  {
    description: "See recent Auckland finishes and project stories.",
    href: "/projects",
    icon: Search,
    label: "Projects",
  },
  {
    description: "Send job details, photos, access notes, and timing.",
    href: "/contact",
    icon: Mail,
    label: "Request a quote",
  },
];

export default function NotFound() {
  return (
    <section className="bg-charcoal text-white" data-testid="not-found-page">
      <div className="site-shell grid min-h-[calc(100svh-80px)] gap-12 py-20 sm:py-24 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-spicy-orange">
            404 / Page not found
          </p>
          <h1 className="balanced mt-6 max-w-3xl text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">
            This link needs a clean make-good.
          </h1>
          <p className="pretty mt-6 max-w-2xl text-lg font-bold leading-8 text-white/68">
            The page may have moved, the address may be outdated, or an external
            link may be pointing to old content. The PlasterPro Solution team is
            still here for Auckland plastering, painting, gib stopping, and
            property presentation work.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              className="gap-2"
              href="/"
              variant="primary"
              data-testid="not-found-home-link"
            >
              <Home size={18} aria-hidden="true" />
              Back Home
            </Button>
            <Button
              className="gap-2"
              href="/contact"
              variant="secondary"
              data-testid="not-found-contact-link"
            >
              Request a Quote
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-12 grid gap-3" aria-label="Helpful pages">
            {helpfulLinks.map(({ description, href, icon: Icon, label }) => (
              <Link
                className="focus-ring group grid gap-3 border-t border-white/12 py-5 transition hover:border-spicy-orange/70 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                href={href}
                key={href}
              >
                <span className="grid size-11 place-items-center rounded-md border border-white/14 bg-white/8 text-spicy-orange transition group-hover:border-spicy-orange group-hover:bg-spicy-orange group-hover:text-white">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xl font-black">{label}</span>
                  <span className="mt-1 block text-sm font-bold leading-6 text-white/58">
                    {description}
                  </span>
                </span>
                <ArrowRight
                  className="hidden text-spicy-orange transition group-hover:translate-x-1 sm:block"
                  size={24}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="relative min-h-[26rem] overflow-hidden rounded-lg border border-white/12 bg-white/[0.055] shadow-[0_30px_90px_rgb(0_0_0/0.28)] sm:min-h-[34rem]">
          <Image
            alt="Finished PlasterPro Solution exterior project"
            className="object-cover opacity-90"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 46vw"
            src={siteConfig.projectGallery[2].image}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(25_23_20/0.04)_0%,rgb(25_23_20/0.18)_38%,rgb(25_23_20/0.86)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-spicy-orange">
              Still looking for a finish?
            </p>
            <p className="mt-3 max-w-md text-3xl font-black leading-tight">
              Start from current project work or send the team the job details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
