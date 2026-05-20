import type { Metadata } from 'next';
import { AnimatedReveal } from '@/components/molecules/animated-reveal';
import { ProjectPostCard } from '@/components/molecules/project-post-card';
import { InnerPageHero } from '@/components/templates/inner-page-hero';
import { getPublishedProjectPosts } from '@/lib/project-posts';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Project stories from PlasterPro Solution, showing plastering, painting, preparation, and finishing work across Auckland.'
};

export default async function ProjectsPage() {
  const posts = await getPublishedProjectPosts();

  return (
    <>
      <InnerPageHero
        eyebrow="Projects"
        title="Behind the finish on Auckland plastering and painting projects."
        body="Explore the preparation, coordination, repair work, coating systems, and finish detail behind selected PlasterPro Solution projects."
        imageSrc={'/assets/hero-projects.jpeg'}
        imageAlt="Finished PlasterPro Solution project exterior"
        meta="Project stories across Auckland"
        pageNumber="02"
      />
      <section className="py-20 sm:py-28">
        <div className="site-shell">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-spicy-orange">Case studies</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-foreground sm:text-6xl">
              A closer look at the work behind each finish.
            </h2>
          </div>

          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <AnimatedReveal
                className={index === 0 ? 'h-full sm:col-span-2' : 'h-full'}
                delay={(index % 4) * 0.04}
                key={post.slug}
              >
                <ProjectPostCard featured={index === 0} post={post} />
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
