"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Expand } from "lucide-react";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import {
  ProjectGalleryLightbox,
  type ProjectGalleryPhoto,
} from "@/components/molecules/project-gallery-lightbox";

type ProjectMosaicGridProps = {
  photos: ProjectGalleryPhoto[];
};

const layoutClasses: Record<string, string> = {
  featured: "md:col-span-2 md:row-span-2 lg:col-span-4 lg:row-span-2",
  tall: "md:row-span-2 lg:col-span-2 lg:row-span-2",
  wide: "md:col-span-2 lg:col-span-4",
  small: "lg:col-span-2",
};

function getTileClass(layout: string) {
  return layoutClasses[layout] ?? layoutClasses.small;
}

export function ProjectMosaicGrid({ photos }: ProjectMosaicGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return current === 0 ? photos.length - 1 : current - 1;
    });
  }, [photos.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return current === photos.length - 1 ? 0 : current + 1;
    });
  }, [photos.length]);

  return (
    <>
      <div className="mt-12 grid auto-rows-[18rem] grid-cols-1 gap-3 md:grid-cols-4 md:auto-rows-[16rem] lg:grid-cols-8 lg:auto-rows-[17rem]">
        {photos.map((photo, index) => (
          <AnimatedReveal
            className={`relative overflow-hidden rounded-lg border border-white/10 bg-white/5 ${getTileClass(
              photo.layout,
            )}`}
            delay={(index % 6) * 0.035}
            key={`${photo.image}-${photo.title}`}
          >
            <button
              aria-label={`Open project image: ${photo.title}`}
              className="focus-ring group relative block h-full w-full overflow-hidden text-left"
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <Image
                alt={photo.title}
                className="object-cover opacity-88 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100 group-focus-visible:scale-105 group-focus-visible:opacity-100"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={photo.image}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(25_23_20/0.02)_0%,rgb(25_23_20/0.18)_36%,rgb(25_23_20/0.78)_100%)] transition duration-500 group-hover:bg-[linear-gradient(180deg,rgb(25_23_20/0)_0%,rgb(25_23_20/0.08)_34%,rgb(25_23_20/0.7)_100%)] group-focus-visible:bg-[linear-gradient(180deg,rgb(25_23_20/0)_0%,rgb(25_23_20/0.08)_34%,rgb(25_23_20/0.7)_100%)]" />
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-spicy-orange transition duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              <span className="absolute right-4 top-4 grid size-10 translate-y-1 place-items-center rounded-full border border-white/16 bg-white/10 text-white opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <Expand size={18} aria-hidden="true" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-spicy-orange">
                  {photo.category}
                </p>
                <h3 className="balanced mt-2 max-w-lg text-2xl font-black leading-tight text-white drop-shadow-[0_3px_20px_rgb(0_0_0/0.32)]">
                  {photo.title}
                </h3>
                <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.16em] text-white/58">
                  {photo.location}
                </p>
              </div>
            </button>
          </AnimatedReveal>
        ))}
      </div>

      <ProjectGalleryLightbox
        activeIndex={activeIndex}
        onClose={closeLightbox}
        onNext={showNext}
        onPrevious={showPrevious}
        photos={photos}
      />
    </>
  );
}
