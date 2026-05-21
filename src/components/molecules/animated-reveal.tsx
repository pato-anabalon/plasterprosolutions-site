"use client";

import { useRef } from "react";
import type { HTMLAttributes } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type AnimatedRevealProps = {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
  delay?: number;
} & HTMLAttributes<HTMLDivElement>;

export function AnimatedReveal({
  children,
  className = "",
  "data-testid": dataTestId = "animated-reveal",
  delay = 0,
  ...props
}: AnimatedRevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const target = scope.current;

      if (!target) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(target, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        target,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: target,
            start: "top 82%",
            once: true,
          },
        },
      );
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className={`motion-safe ${className}`}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </div>
  );
}
