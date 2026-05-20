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
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Project gallery"
            title="A living archive of finishes, details, and site progress."
            body="A more visual space for project photography as new work is completed across Auckland."
            tone="dark"
          />
        </div>

        <ProjectMosaicGrid photos={photos} />
      </div>
    </section>
  );
}
