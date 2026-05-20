import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { ProjectLikeButton } from '@/components/molecules/project-like-button';
import { ProjectMarkdownContent } from '@/components/molecules/project-markdown-content';
import { ProjectPostViewTracker } from '@/components/molecules/project-post-view-tracker';
import { ProjectShareButton } from '@/components/molecules/project-share-button';
import { ProjectMosaicGallery } from '@/components/organisms/project-mosaic-gallery';
import { hasProjectPostsDatabase, toProjectGalleryPhotos, type ProjectPost } from '@/lib/project-posts';

type ProjectArticleProps = {
  nextPost: ProjectPost | null;
  post: ProjectPost;
  previousPost: ProjectPost | null;
};

function ArticleImageStrip({ post }: { post: ProjectPost }) {
  const images = post.images.slice(1, 4);

  if (!images.length) {
    return null;
  }

  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-3">
      {images.map((image) => (
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-charcoal/8" key={image.image}>
          <Image
            alt={image.alt}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={image.image}
          />
        </div>
      ))}
    </div>
  );
}

function ProjectArticleBody({ post }: { post: ProjectPost }) {
  if (post.layoutVariant === 'feature-left') {
    return (
      <div className="site-shell grid gap-10 py-16 lg:grid-cols-[0.78fr_1fr] lg:py-24">
        <div className="relative min-h-[24rem] overflow-hidden rounded-lg bg-charcoal/8 lg:sticky lg:top-28 lg:h-[calc(100vh-9rem)]">
          <Image
            alt={post.title}
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            src={post.heroImage}
          />
        </div>
        <div className="max-w-3xl">
          <ProjectMarkdownContent markdown={post.bodyMarkdown} />
        </div>
      </div>
    );
  }

  if (post.layoutVariant === 'gallery-led') {
    return (
      <div className="site-shell py-16 lg:py-24">
        <ArticleImageStrip post={post} />
        <div className="mx-auto mt-14 max-w-3xl">
          <ProjectMarkdownContent markdown={post.bodyMarkdown} />
        </div>
      </div>
    );
  }

  return (
    <div className="site-shell grid gap-10 py-16 lg:grid-cols-[1fr_0.72fr] lg:py-24">
      <div className="max-w-3xl">
        <ProjectMarkdownContent markdown={post.bodyMarkdown} />
      </div>
      <div className="grid content-start gap-3">
        {post.images.slice(1, 3).map((image) => (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-charcoal/8" key={image.image}>
            <Image
              alt={image.alt}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 38vw"
              src={image.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectNavigation({
  nextPost,
  previousPost
}: {
  nextPost: ProjectPost | null;
  previousPost: ProjectPost | null;
}) {
  if (!nextPost && !previousPost) {
    return null;
  }

  return (
    <nav aria-label="Project story navigation" className="site-shell grid gap-3 py-12 sm:grid-cols-2">
      {previousPost ? (
        <Link
          className="surface-panel focus-ring group rounded-lg p-5 transition hover:-translate-y-1 hover:border-spicy-orange"
          href={`/projects/${previousPost.slug}`}
        >
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-spicy-orange">
            <ArrowLeft size={16} aria-hidden="true" />
            Previous project
          </span>
          <span className="mt-3 block text-xl font-black text-foreground">{previousPost.title}</span>
        </Link>
      ) : (
        <span />
      )}

      {nextPost ? (
        <Link
          className="surface-panel focus-ring group rounded-lg p-5 text-right transition hover:-translate-y-1 hover:border-spicy-orange"
          href={`/projects/${nextPost.slug}`}
        >
          <span className="inline-flex items-center justify-end gap-2 text-xs font-black uppercase tracking-[0.16em] text-spicy-orange">
            Next project
            <ArrowRight size={16} aria-hidden="true" />
          </span>
          <span className="mt-3 block text-xl font-black text-foreground">{nextPost.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}

function ProjectArticleCta() {
  return (
    <section className="bg-spicy-orange py-16 text-white sm:py-20">
      <div className="site-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Start your project</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Need a finish that holds up in the real world?
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
            Send the project details and the PlasterPro Solution team will help scope the next step clearly.
          </p>
        </div>
        <Button href="/contact" variant="dark">
          Request a quote
        </Button>
      </div>
    </section>
  );
}

export function ProjectArticle({ nextPost, post, previousPost }: ProjectArticleProps) {
  const galleryPhotos = toProjectGalleryPhotos(post);

  return (
    <>
      <ProjectPostViewTracker slug={post.slug} title={post.title} />
      <article>
        <header className="bg-surface py-14 sm:py-20">
          <div className="site-shell">
            <nav aria-label="Breadcrumb" className="text-xs font-black uppercase tracking-[0.16em] text-muted">
              <Link className="transition hover:text-spicy-orange" href="/projects">
                Projects
              </Link>
              <span className="mx-2 text-spicy-orange">/</span>
              <span>{post.location}</span>
            </nav>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-spicy-orange">{post.category}</p>
                <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.95] text-foreground sm:text-7xl">
                  {post.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-muted sm:text-xl">{post.excerpt}</p>
              </div>

              <div className="grid gap-4 rounded-lg border border-border bg-background p-5">
                <div className="grid gap-3 text-sm font-extrabold uppercase tracking-[0.12em] text-muted">
                  <span>{post.location}</span>
                  <span>{post.service}</span>
                  <span>{post.readingTimeMinutes} min read</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <ProjectLikeButton
                    enabled={hasProjectPostsDatabase()}
                    initialCount={post.likeCount}
                    slug={post.slug}
                    title={post.title}
                  />
                  <ProjectShareButton slug={post.slug} title={post.title} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <ProjectArticleBody post={post} />
      </article>
      <ProjectArticleCta />
      <ProjectMosaicGallery photos={galleryPhotos} />
      <ProjectNavigation nextPost={nextPost} previousPost={previousPost} />
    </>
  );
}
