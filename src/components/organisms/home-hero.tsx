"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BrandLogo } from "@/components/atoms/brand-logo";

gsap.registerPlugin(useGSAP);

const heroTitle = "Premium finishes for Auckland properties.";
const heroTitleLines = ["Premium finishes", "for Auckland properties."];
const logoGridCells = Array.from({ length: 96 }, (_, index) => index);

export function HomeHero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(
          ".hero-panel, .hero-title-line, .hero-body, .hero-scroll-indicator",
          {
            autoAlpha: 1,
            y: 0,
            yPercent: 0,
          },
        );
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(
          ".hero-panel",
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.78, stagger: 0.06 },
        )
        .fromTo(
          ".hero-title-line",
          { autoAlpha: 0, yPercent: 115 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.86,
            ease: "expo.out",
            stagger: 0.11,
          },
          "-=0.34",
        )
        .fromTo(
          ".hero-body",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.62 },
          "-=0.52",
        )
        .fromTo(
          ".hero-scroll-indicator",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5 },
          "-=0.18",
        )
        .to(
          ".hero-scroll-dot",
          {
            autoAlpha: 0.18,
            y: 22,
            duration: 1.05,
            ease: "power2.inOut",
            repeat: -1,
            repeatDelay: 0.15,
          },
          "-=0.1",
        );
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-background text-charcoal" data-testid="home-hero">
      <div
        className="relative grid min-h-[calc(100svh-80px)] w-full overflow-hidden border-y border-charcoal/12 bg-surface md:grid-cols-2 lg:h-[calc(100svh-80px)] lg:min-h-[38rem] lg:grid-cols-12 lg:grid-rows-[15rem_minmax(0,1fr)_30svh]"
        data-testid="home-hero-layout"
      >
        <div
          className="hero-panel group relative hidden min-h-40 place-items-center overflow-hidden border-b border-charcoal/10 bg-surface opacity-0 transition duration-500 lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-2 lg:grid lg:min-h-0 lg:border-r lg:pb-0"
          data-testid="home-hero-logo-panel"
        >
          <div
            className="absolute inset-0 grid grid-cols-[repeat(16,minmax(0,1fr))] grid-rows-[repeat(6,minmax(0,1fr))]"
            data-testid="home-hero-logo-grid"
            aria-hidden="true"
          >
            {logoGridCells.map((cell) => (
              <span
                className="border-b border-r border-surface bg-surface transition-colors duration-700 hover:border-[rgba(227,65,15,0.18)] hover:bg-[rgba(227,65,15,0.16)] hover:duration-75"
                key={cell}
              />
            ))}
          </div>
          <BrandLogo
            className="relative z-10 w-[min(72vw,23rem)] transition duration-500 group-hover:scale-[1.03]"
            priority
            sizes="(max-width: 1024px) 72vw, 23rem"
            variant="short"
          />
        </div>

        <div
          className="hero-panel group relative min-h-[17rem] overflow-hidden border-b border-charcoal/10 bg-charcoal opacity-0 md:col-span-2 lg:col-start-7 lg:col-end-13 lg:row-start-1 lg:row-end-3 lg:min-h-0"
          data-testid="home-hero-video-panel"
        >
          <video
            className="h-full min-h-[17rem] w-full object-cover transition duration-700 group-hover:scale-[1.025] lg:min-h-0"
            data-testid="home-hero-video"
            src="/assets/plasterpro-solution-home-video-720.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,23,20,0.04),rgba(25,23,20,0.32))]" />
          <div
            className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-charcoal/42 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur"
            data-testid="home-hero-video-caption"
          >
            Auckland sites in progress
          </div>
        </div>

        <div
          className="hero-panel flex min-h-[27rem] flex-col justify-end overflow-hidden border-b border-charcoal/10 p-6 opacity-0 sm:p-8 md:col-span-2 lg:col-start-1 lg:col-end-7 lg:row-start-2 lg:row-end-4 lg:min-h-0 lg:border-r lg:border-b-0 lg:p-8 xl:p-9"
          data-testid="home-hero-copy-panel"
        >
          <div>
            <p
              className="text-sm font-extrabold uppercase tracking-[0.22em] text-spicy-orange"
              data-testid="home-hero-eyebrow"
            >
              Auckland plastering and painting specialists
            </p>
            <h1
              className="balanced mt-7 max-w-3xl text-5xl font-black leading-[0.94] sm:text-6xl lg:text-6xl"
              data-testid="home-hero-title"
              aria-label={heroTitle}
            >
              <span aria-hidden="true" className="block">
                {heroTitleLines.map((line) => (
                  <span className="block overflow-hidden pb-2" key={line}>
                    <span className="hero-title-line block opacity-0 will-change-transform">
                      {line}
                    </span>
                  </span>
                ))}
              </span>
            </h1>
            <p
              className="hero-body pretty mt-6 max-w-2xl text-xl leading-9 text-muted opacity-0"
              data-testid="home-hero-body"
            >
              PlasterPro Solution delivers quality plastering, painting, gib
              stopping, and real estate make-ready work across Auckland.{" "}
              <strong>Your vision, our commitment to excellence.</strong>
            </p>
            <div
              className="hero-scroll-indicator pointer-events-none mt-8 hidden items-center gap-3 opacity-0 lg:flex"
              data-testid="home-hero-scroll-indicator"
            >
              <span className="relative h-12 w-px overflow-hidden bg-charcoal/16">
                <span className="hero-scroll-dot absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-spicy-orange" />
              </span>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-charcoal/42">
                Scroll to explore
              </span>
            </div>
          </div>
        </div>

        <Link
          className="focus-ring hero-panel group relative flex min-h-52 flex-col justify-between overflow-hidden border-b border-charcoal/10 p-6 opacity-0 transition duration-500 hover:border-spicy-orange/35 hover:bg-[rgba(227,65,15,0.08)] sm:p-8 md:col-span-1 md:border-b-0 md:border-r lg:col-start-7 lg:col-end-10 lg:row-start-3 lg:row-end-4 lg:min-h-0"
          data-testid="home-hero-work-link"
          href="/projects"
        >
          <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-spicy-orange transition duration-500 group-hover:scale-x-100" />
          <span className="flex justify-end text-charcoal/42 transition duration-300 group-hover:text-spicy-orange">
            <ArrowRight
              className="transition duration-300 group-hover:translate-x-1.5"
              size={24}
              aria-hidden="true"
            />
          </span>
          <span className="space-y-4">
            <span className="balanced block text-[2.15rem] font-black leading-[0.95] text-charcoal sm:text-[2.65rem] xl:text-[3rem]">
              Work
            </span>
            <span className="block text-base font-bold leading-7 text-muted sm:text-lg">
              Explore recent finishes.
            </span>
          </span>
        </Link>

        <Link
          className="focus-ring hero-panel group relative flex min-h-52 flex-col justify-between overflow-hidden bg-charcoal p-6 text-white opacity-0 transition duration-500 hover:bg-charcoal-brown sm:p-8 md:col-span-1 lg:col-start-10 lg:col-end-13 lg:row-start-3 lg:row-end-4 lg:min-h-0"
          data-testid="home-hero-quote-link"
          href="/contact"
        >
          <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-spicy-orange transition duration-500 group-hover:scale-x-100" />
          <span className="flex justify-end text-white/42 transition duration-300 group-hover:text-spicy-orange">
            <ArrowRight
              className="transition duration-300 group-hover:translate-x-1.5"
              size={24}
              aria-hidden="true"
            />
          </span>
          <span className="space-y-4">
            <span className="balanced block text-[2.15rem] font-black leading-[0.95] text-white sm:text-[2.65rem] lg:whitespace-nowrap xl:text-[3rem]">
              Request a quote
            </span>
            <span className="block text-base font-bold leading-7 text-white/68 sm:text-lg">
              Tell us about your idea.
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
