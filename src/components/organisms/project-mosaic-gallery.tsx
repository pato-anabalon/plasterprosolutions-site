import { SectionHeading } from "@/components/molecules/section-heading";
import { ProjectMosaicGrid } from "@/components/organisms/project-mosaic-grid";
import type { ProjectGalleryPhoto } from "@/components/molecules/project-gallery-lightbox";

type ProjectMosaicGalleryProps = {
  photos: ProjectGalleryPhoto[];
};

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

        <ProjectMosaicGrid photos={photos} />
      </div>
    </section>
  );
}
