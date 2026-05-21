"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ProjectArticleHeroMediaProps = {
  alt: string;
  src: string;
};

export function ProjectArticleHeroMedia({
  alt,
  src,
}: ProjectArticleHeroMediaProps) {
  const scope = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const image = imageRef.current;

      if (!image) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(image, { clearProps: "transform" });
        return;
      }

      gsap.fromTo(
        image,
        { yPercent: -7 },
        {
          ease: "none",
          scrollTrigger: {
            end: "bottom top",
            scrub: 0.85,
            start: "top top",
            trigger: scope.current,
          },
          yPercent: 7,
        },
      );
    },
    { scope },
  );

  return (
    <div
      className="absolute inset-0 -z-20 overflow-hidden bg-charcoal"
      data-testid="project-article-hero-media"
      ref={scope}
    >
      <Image
        alt={alt}
        className="scale-110 object-cover will-change-transform"
        data-testid="project-article-hero-image"
        fill
        priority
        ref={imageRef}
        sizes="100vw"
        src={src}
      />
    </div>
  );
}
