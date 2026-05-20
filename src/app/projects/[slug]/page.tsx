import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectArticle } from "@/components/organisms/project-article";
import { siteConfig } from "@/data/site";
import {
  getProjectPost,
  getProjectPostSlugs,
  getPublishedProjectPosts,
} from "@/lib/project-posts";

type ProjectPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getProjectPostSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getProjectPost(slug);

  if (!post) {
    return {
      title: "Project not found",
    };
  }

  const url = `/projects/${post.slug}`;

  return {
    alternates: {
      canonical: url,
    },
    description: post.seoDescription,
    openGraph: {
      description: post.seoDescription,
      images: [
        {
          alt: post.title,
          url: post.heroImage,
        },
      ],
      title: post.seoTitle,
      type: "article",
      url,
    },
    title: post.seoTitle,
  };
}

export default async function ProjectPostPage({ params }: ProjectPostPageProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([
    getProjectPost(slug),
    getPublishedProjectPosts(),
  ]);

  if (!post || post.status !== "published") {
    notFound();
  }

  const postIndex = posts.findIndex((item) => item.slug === post.slug);
  const previousPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost =
    postIndex >= 0 && postIndex < posts.length - 1 ? posts[postIndex + 1] : null;
  const articleUrl = `${siteConfig.url}/projects/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    author: {
      "@type": "Organization",
      name: "PlasterPro Solution",
    },
    dateModified: post.updatedAt || post.publishedAt,
    datePublished: post.publishedAt,
    description: post.seoDescription,
    headline: post.title,
    image: `${siteConfig.url}${post.heroImage}`,
    mainEntityOfPage: articleUrl,
    publisher: {
      "@type": "Organization",
      name: "PlasterPro Solution",
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: siteConfig.url,
        name: "Home",
        position: 1,
      },
      {
        "@type": "ListItem",
        item: `${siteConfig.url}/projects`,
        name: "Projects",
        position: 2,
      },
      {
        "@type": "ListItem",
        item: articleUrl,
        name: post.title,
        position: 3,
      },
    ],
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        type="application/ld+json"
      />
      <ProjectArticle nextPost={nextPost} post={post} previousPost={previousPost} />
    </>
  );
}
