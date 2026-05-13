"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type ProjectGalleryPhoto = {
  category: string;
  image: string;
  layout: string;
  location: string;
  title: string;
};

type ProjectGalleryLightboxProps = {
  activeIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  photos: ProjectGalleryPhoto[];
};

export function ProjectGalleryLightbox({
  activeIndex,
  onClose,
  onNext,
  onPrevious,
  photos,
}: ProjectGalleryLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  useEffect(() => {
    if (!activePhoto) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        onPrevious();
      }

      if (event.key === "ArrowRight") {
        onNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto, onClose, onNext, onPrevious]);

  if (!activePhoto || activeIndex === null) {
    return null;
  }

  return (
    <div
      aria-label={`${activePhoto.title} full-size image`}
      aria-modal="true"
      className="fixed inset-0 z-[90] grid bg-charcoal/94 p-3 text-white backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
    >
      <div className="relative grid min-h-0 grid-rows-[auto_1fr_auto] gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-spicy-orange">
              {activePhoto.category}
            </p>
            <h2 className="mt-2 text-xl font-black leading-tight sm:text-3xl">
              {activePhoto.title}
            </h2>
          </div>
          <button
            aria-label="Close project image"
            className="focus-ring grid size-11 shrink-0 place-items-center rounded-full border border-white/14 bg-white/10 text-white transition hover:border-spicy-orange hover:bg-spicy-orange"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="relative min-h-0 overflow-hidden rounded-lg border border-white/12 bg-black/34">
          <Image
            alt={activePhoto.title}
            className="object-contain"
            fill
            priority
            sizes="100vw"
            src={activePhoto.image}
          />

          <button
            aria-label="Previous project image"
            className="focus-ring absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/14 bg-charcoal/70 text-white backdrop-blur transition hover:border-spicy-orange hover:bg-spicy-orange sm:left-5 sm:size-12"
            onClick={onPrevious}
            type="button"
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>
          <button
            aria-label="Next project image"
            className="focus-ring absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/14 bg-charcoal/70 text-white backdrop-blur transition hover:border-spicy-orange hover:bg-spicy-orange sm:right-5 sm:size-12"
            onClick={onNext}
            type="button"
          >
            <ChevronRight size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col justify-between gap-2 text-sm font-extrabold uppercase tracking-[0.16em] text-white/58 sm:flex-row sm:items-center">
          <span>{activePhoto.location}</span>
          <span>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(photos.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
