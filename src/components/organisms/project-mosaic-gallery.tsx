import Image from "next/image";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { SectionHeading } from "@/components/molecules/section-heading";

type MosaicPhoto = {
  category: string;
  image: string;
  layout: string;
  location: string;
  title: string;
};

type ProjectMosaicGalleryProps = {
  photos: MosaicPhoto[];
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

export function ProjectMosaicGallery({ photos }: ProjectMosaicGalleryProps) {
  return (
    <section className="bg-charcoal py-20 text-white sm:py-28">
      <div className="site-shell">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_0.45fr] lg:items-end">
          <SectionHeading
            eyebrow="Project gallery"
            title="A living archive of finishes, details, and site progress."
            body="A more visual space for project photography as new work is completed across Auckland."
            tone="dark"
          />
          <p className="max-w-md text-base font-bold leading-7 text-white/54 lg:justify-self-end lg:text-right">
            Add new project images to the project assets folder and map them in
            the gallery data to keep this section growing over time.
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[18rem] grid-cols-1 gap-3 md:grid-cols-4 md:auto-rows-[16rem] lg:grid-cols-8 lg:auto-rows-[17rem]">
          {photos.map((photo, index) => (
            <AnimatedReveal
              className={`group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 ${getTileClass(
                photo.layout,
              )}`}
              delay={(index % 6) * 0.035}
              key={`${photo.image}-${photo.title}`}
            >
              <Image
                alt={photo.title}
                className="object-cover opacity-88 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={photo.image}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(25_23_20/0.02)_0%,rgb(25_23_20/0.18)_36%,rgb(25_23_20/0.78)_100%)] transition duration-500 group-hover:bg-[linear-gradient(180deg,rgb(25_23_20/0)_0%,rgb(25_23_20/0.08)_34%,rgb(25_23_20/0.7)_100%)]" />
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-spicy-orange transition duration-500 group-hover:scale-x-100" />
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
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
