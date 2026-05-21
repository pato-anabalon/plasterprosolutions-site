import Image from "next/image";
import { Button } from "@/components/atoms/button";

type InnerPageHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
  imageAlt?: string;
  imageSrc?: string;
  meta?: string;
  pageNumber?: string;
};

export function InnerPageHero({
  eyebrow,
  title,
  body,
  imageAlt = "",
  imageSrc,
  meta = "Auckland finish specialists",
  pageNumber = "01",
}: InnerPageHeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden bg-charcoal text-white"
      data-testid="inner-page-hero"
    >
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(128deg,rgba(25,23,20,0.98)_0%,rgba(65,63,61,0.95)_50%,rgba(227,65,15,0.18)_100%)]" />
      <div className="absolute inset-0 -z-20 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:96px_96px]" />
      <div className="absolute -right-24 bottom-0 -z-10 hidden h-80 w-80 rounded-full bg-spicy-orange/18 blur-3xl lg:block" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-white/12" />

      <div className="site-shell relative grid gap-10 py-16 sm:py-20 lg:min-h-[34rem] lg:grid-cols-[minmax(0,0.98fr)_minmax(22rem,0.72fr)] lg:items-end lg:py-24">
        <div className="relative z-10 max-w-4xl" data-testid="inner-page-hero-content">
          <div className="flex items-center gap-4">
            <p
              className="text-sm font-extrabold uppercase tracking-[0.22em] text-spicy-orange"
              data-testid="inner-page-hero-eyebrow"
            >
              {eyebrow}
            </p>
            <span className="h-px w-12 bg-spicy-orange/70" aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/46">
              {pageNumber}
            </p>
          </div>
          <h1
            className="balanced mt-5 max-w-4xl text-4xl font-black leading-[1.02] sm:text-6xl lg:text-7xl"
            data-testid="inner-page-hero-title"
          >
            {title}
          </h1>
          <p
            className="pretty mt-6 max-w-3xl text-lg leading-8 text-white/72 sm:text-xl sm:leading-9"
            data-testid="inner-page-hero-body"
          >
            {body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button href="/contact">Request a Quote</Button>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/42">
              {meta}
            </p>
          </div>
        </div>

        {imageSrc ? (
          <div className="relative z-0 lg:self-stretch" data-testid="inner-page-hero-media">
            <p className="pointer-events-none absolute -right-2 -top-10 z-10 hidden text-[9rem] font-black leading-none text-white/[0.055] lg:block">
              {pageNumber}
            </p>
            <div className="group relative min-h-[20rem] overflow-hidden rounded-lg border border-white/12 bg-white/8 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:min-h-[24rem] lg:h-full">
              <Image
                className="object-cover opacity-78 grayscale transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0"
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,23,20,0.04)_0%,rgba(25,23,20,0.45)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-white/18 pt-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/62">
                  PlasterPro Solution
                </span>
                <span className="h-2 w-2 rounded-full bg-spicy-orange" aria-hidden="true" />
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden justify-self-end lg:block">
            <div className="h-28 w-28 border-l border-t border-white/18" />
          </div>
        )}

        <div className="pointer-events-none absolute bottom-6 left-4 hidden text-[11rem] font-black leading-none text-white/[0.035] sm:block lg:left-8">
          {pageNumber}
        </div>
      </div>
    </section>
  );
}
