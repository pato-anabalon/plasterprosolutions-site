"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BrandLogo } from "@/components/atoms/brand-logo";

gsap.registerPlugin(useGSAP);

export function SitePreloader() {
  const [isVisible, setIsVisible] = useState(true);
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fallback = window.setTimeout(() => setIsVisible(false), 3600);

    return () => window.clearTimeout(fallback);
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setIsVisible(false);
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setIsVisible(false),
      });

      timeline
        .fromTo(
          ".preloader-mark",
          { autoAlpha: 0, y: 18, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.45 },
        )
        .fromTo(
          ".preloader-logo-color",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power2.inOut",
          },
          "-=0.1",
        )
        .fromTo(
          ".preloader-bar-fill",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: "power2.inOut" },
          "<",
        )
        .to(".preloader-copy", { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.25")
        .to(scope.current, { autoAlpha: 0, duration: 0.42, delay: 0.25 });
    },
    { scope },
  );

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={scope}
      className="fixed inset-0 z-50 grid place-items-center bg-surface text-charcoal"
      data-testid="site-preloader"
      aria-label="Loading PlasterProSolution"
      role="status"
    >
      <div
        className="preloader-mark grid w-[min(78vw,23rem)] gap-7 text-center opacity-0"
        data-testid="site-preloader-content"
      >
        <div
          className="relative mx-auto aspect-[1023/376] w-full"
          data-testid="site-preloader-logo"
        >
          <BrandLogo
            alt=""
            className="absolute inset-0 w-full"
            imageClassName="opacity-55 [filter:grayscale(1)_contrast(0.08)]"
            priority
            sizes="(max-width: 480px) 78vw, 23rem"
          />
          <div className="preloader-logo-color absolute inset-0 overflow-hidden [clip-path:inset(100%_0%_0%_0%)]">
            <BrandLogo
              className="w-full"
              priority
              sizes="(max-width: 480px) 78vw, 23rem"
            />
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-charcoal/12" data-testid="site-preloader-bar">
          <div
            className="preloader-bar-fill h-full origin-left scale-x-0 rounded-full bg-spicy-orange shadow-[0_0_28px_rgba(227,65,15,0.5)]"
            data-testid="site-preloader-bar-fill"
          />
        </div>

        <p
          className="preloader-copy translate-y-2 text-sm font-black uppercase tracking-[0.22em] text-charcoal/58 opacity-0"
          data-testid="site-preloader-copy"
        >
          Preparing the finish
        </p>
      </div>
    </div>
  );
}
