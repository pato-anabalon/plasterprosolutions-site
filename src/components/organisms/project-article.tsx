import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock3, Hammer, MapPin } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { ProjectArticleHeroMedia } from '@/components/molecules/project-article-hero-media';
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

function getArticleHeaderHero(post: ProjectPost) {
  return post.images.find((image) => image.isHero) ?? null;
}

function getNavigationImage(post: ProjectPost) {
  return getArticleHeaderHero(post)?.image ?? post.heroImage;
}

function ArticleImageStrip({ post }: { post: ProjectPost }) {
  const images = post.images.slice(1, 4);

  if (!images.length) {
    return null;
  }

  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-3" data-testid="project-article-image-strip">
      {images.map((image) => (
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-lg bg-charcoal/8"
          data-testid="project-article-image-strip-item"
          key={image.image}
        >
          <Image
            alt={image.alt}
            className="object-cover"
            data-testid="project-article-image-strip-image"
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
      <div
        className="site-shell grid gap-10 py-16 lg:grid-cols-[0.78fr_1fr] lg:py-24"
        data-testid="project-article-body-feature-left"
      >
        <div
          className="relative min-h-[24rem] overflow-hidden rounded-lg bg-charcoal/8 lg:sticky lg:top-28 lg:h-[calc(100vh-9rem)]"
          data-testid="project-article-feature-image"
        >
          <Image
            alt={post.title}
            className="object-cover"
            data-testid="project-article-feature-image-img"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            src={post.heroImage}
          />
        </div>
        <div className="max-w-3xl" data-testid="project-article-content">
          <ProjectMarkdownContent markdown={post.bodyMarkdown} />
        </div>
      </div>
    );
  }

  if (post.layoutVariant === 'gallery-led') {
    return (
      <div className="site-shell py-16 lg:py-24" data-testid="project-article-body-gallery-led">
        <ArticleImageStrip post={post} />
        <div className="mx-auto mt-14 max-w-3xl" data-testid="project-article-content">
          <ProjectMarkdownContent markdown={post.bodyMarkdown} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="site-shell grid gap-10 py-16 lg:grid-cols-[1fr_0.72fr] lg:py-24"
      data-testid="project-article-body-editorial-split"
    >
      <div className="max-w-3xl" data-testid="project-article-content">
        <ProjectMarkdownContent markdown={post.bodyMarkdown} />
      </div>
      <div className="grid content-start gap-3" data-testid="project-article-side-images">
        {post.images.slice(1, 3).map((image) => (
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-lg bg-charcoal/8"
            data-testid="project-article-side-image"
            key={image.image}
          >
            <Image
              alt={image.alt}
              className="object-cover"
              data-testid="project-article-side-image-img"
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
    <nav
      aria-label="Project story navigation"
      className="site-shell grid gap-4 py-12 sm:grid-cols-2"
      data-testid="project-article-navigation"
    >
      {previousPost ? (
        <Link
          className="focus-ring group relative flex min-h-[18rem] overflow-hidden rounded-lg border border-border bg-charcoal text-white shadow-[0_24px_72px_rgb(25_23_20/0.14)] transition duration-500 hover:-translate-y-1 hover:border-spicy-orange hover:shadow-[0_34px_90px_rgb(227_65_15/0.18)]"
          data-testid="project-article-previous-link"
          href={`/projects/${previousPost.slug}`}
        >
          <Image
            alt=""
            className="object-cover opacity-74 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-92"
            data-testid="project-article-previous-image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            src={getNavigationImage(previousPost)}
          />
          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgb(25_23_20/0.18)_0%,rgb(25_23_20/0.58)_48%,rgb(25_23_20/0.94)_100%)] transition duration-500 group-hover:bg-[linear-gradient(180deg,rgb(25_23_20/0.08)_0%,rgb(25_23_20/0.46)_48%,rgb(25_23_20/0.9)_100%)]" />
          <span className="absolute inset-x-0 top-0 h-1 origin-right scale-x-0 bg-spicy-orange transition duration-500 group-hover:scale-x-100" />
          <span className="absolute left-5 top-5 grid size-11 place-items-center rounded-full border border-white/16 bg-white/10 text-white backdrop-blur transition duration-300 group-hover:border-spicy-orange group-hover:bg-spicy-orange">
            <ArrowLeft size={20} aria-hidden="true" />
          </span>
          <span className="relative z-10 mt-auto grid gap-4 self-end p-5 sm:p-6">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-spicy-orange">
              Previous project
            </span>
            <span className="balanced block max-w-xl text-[length:var(--text-2xl)] font-black leading-tight text-white">
              {previousPost.title}
            </span>
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/58">
              {previousPost.location}
            </span>
          </span>
        </Link>
      ) : (
        <span />
      )}

      {nextPost ? (
        <Link
          className="focus-ring group relative flex min-h-[18rem] overflow-hidden rounded-lg border border-border bg-charcoal text-right text-white shadow-[0_24px_72px_rgb(25_23_20/0.14)] transition duration-500 hover:-translate-y-1 hover:border-spicy-orange hover:shadow-[0_34px_90px_rgb(227_65_15/0.18)]"
          data-testid="project-article-next-link"
          href={`/projects/${nextPost.slug}`}
        >
          <Image
            alt=""
            className="object-cover opacity-74 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-92"
            data-testid="project-article-next-image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            src={getNavigationImage(nextPost)}
          />
          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgb(25_23_20/0.18)_0%,rgb(25_23_20/0.58)_48%,rgb(25_23_20/0.94)_100%)] transition duration-500 group-hover:bg-[linear-gradient(180deg,rgb(25_23_20/0.08)_0%,rgb(25_23_20/0.46)_48%,rgb(25_23_20/0.9)_100%)]" />
          <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-spicy-orange transition duration-500 group-hover:scale-x-100" />
          <span className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-white/16 bg-white/10 text-white backdrop-blur transition duration-300 group-hover:border-spicy-orange group-hover:bg-spicy-orange">
            <ArrowRight size={20} aria-hidden="true" />
          </span>
          <span className="relative z-10 ml-auto mt-auto grid gap-4 self-end p-5 sm:p-6">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-spicy-orange">
              Next project
            </span>
            <span className="balanced block max-w-xl text-[length:var(--text-2xl)] font-black leading-tight text-white">
              {nextPost.title}
            </span>
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/58">
              {nextPost.location}
            </span>
          </span>
        </Link>
      ) : null}
    </nav>
  );
}

function ProjectArticleCta() {
  return (
    <section className="bg-spicy-orange py-16 text-white sm:py-20" data-testid="project-article-cta">
      <div
        className="site-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"
        data-testid="project-article-cta-layout"
      >
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
  const headerHero = getArticleHeaderHero(post);

  return (
    <>
      <ProjectPostViewTracker slug={post.slug} title={post.title} />
      <article data-testid="project-article">
        <header
          className="relative isolate min-h-[calc(100svh-80px)] overflow-hidden bg-charcoal py-8 text-white sm:py-10 lg:min-h-[42rem]"
          data-testid="project-article-header"
        >
          <ProjectArticleHeroMedia alt={headerHero?.alt ?? post.title} src={headerHero?.image ?? post.heroImage} />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(25_23_20/0.88)_0%,rgb(25_23_20/0.64)_46%,rgb(25_23_20/0.28)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(25_23_20/0.32)_0%,rgb(25_23_20/0.08)_34%,rgb(25_23_20/0.92)_100%)]" />
          <div className="absolute inset-0 -z-10 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:92px_92px]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-white/14" />

          <div className="site-shell flex min-h-[calc(100svh-144px)] flex-col justify-between gap-14 lg:min-h-[35rem]">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/62"
              data-testid="project-article-breadcrumb"
            >
              <Link className="transition hover:text-spicy-orange" href="/projects">
                Projects
              </Link>
              <span className="text-spicy-orange">/</span>
              <span className="text-white/82">{post.location}</span>
            </nav>

            <div
              className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)] lg:items-end"
              data-testid="project-article-hero"
            >
              <div className="max-w-5xl" data-testid="project-article-hero-copy">
                <p
                  className="inline-flex rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-spicy-orange shadow-[0_18px_46px_rgb(0_0_0/0.2)] backdrop-blur-md"
                  data-testid="project-article-category"
                >
                  {post.category}
                </p>
                <h1
                  className="mt-6 max-w-5xl text-5xl font-black leading-[0.92] text-white sm:text-7xl lg:text-8xl"
                  data-testid="project-article-title"
                >
                  {post.title}
                </h1>
                <p
                  className="pretty mt-6 max-w-3xl text-lg font-semibold leading-8 text-white/74 sm:text-xl sm:leading-9"
                  data-testid="project-article-excerpt"
                >
                  {post.excerpt}
                </p>
              </div>

              <div
                className="grid gap-5 rounded-lg border border-white/14 bg-charcoal/34 p-5 shadow-[0_24px_80px_rgb(0_0_0/0.3)] backdrop-blur-xl"
                data-testid="project-article-meta-card"
              >
                <div
                  className="grid gap-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white/72"
                  data-testid="project-article-meta-list"
                >
                  <span className="flex items-center gap-3" data-testid="project-article-location">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/12 bg-white/8 text-spicy-orange">
                      <MapPin size={16} strokeWidth={2.4} aria-hidden="true" />
                    </span>
                    {post.location}
                  </span>
                  <span className="flex items-center gap-3" data-testid="project-article-service">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/12 bg-white/8 text-spicy-orange">
                      <Hammer size={16} strokeWidth={2.4} aria-hidden="true" />
                    </span>
                    {post.service}
                  </span>
                  <span className="flex items-center gap-3" data-testid="project-article-reading-time">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/12 bg-white/8 text-spicy-orange">
                      <Clock3 size={16} strokeWidth={2.4} aria-hidden="true" />
                    </span>
                    {post.readingTimeMinutes} min read
                  </span>
                </div>
                <div className="flex flex-wrap gap-3" data-testid="project-article-actions">
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
      <ProjectMosaicGallery photos={galleryPhotos} />
      <ProjectNavigation nextPost={nextPost} previousPost={previousPost} />
      <ProjectArticleCta />
    </>
  );
}
