import { SectionHeading } from "@/components/molecules/section-heading";
import { ProjectMosaicGrid } from "@/components/organisms/project-mosaic-grid";
import type { ProjectGalleryPhoto } from "@/components/molecules/project-gallery-lightbox";

type ProjectMosaicGalleryProps = {
  photos: ProjectGalleryPhoto[];
};

export function ProjectMosaicGallery({ photos }: ProjectMosaicGalleryProps) {
  return (
    <section
      className="bg-charcoal py-20 text-white sm:py-28"
      data-testid="project-mosaic-gallery"
    >
      <div className="site-shell">
        <div className="max-w-3xl" data-testid="project-mosaic-gallery-heading">
          <SectionHeading
            eyebrow="More from this project"
            title="Details, progress, and finished surfaces from the same job."
            body="A closer visual look at the preparation, site conditions, and finishing work behind this project."
            tone="dark"
          />
        </div>

        <ProjectMosaicGrid photos={photos} />
      </div>
    </section>
  );
}
