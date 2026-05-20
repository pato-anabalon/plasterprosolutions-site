import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import type { ProjectGalleryPhoto } from "@/components/molecules/project-gallery-lightbox";
import projectPostSeeds from "@/data/project-post-seeds.json";

export type ProjectLayoutVariant =
  | "feature-left"
  | "editorial-split"
  | "gallery-led";

export type ProjectPostStatus = "draft" | "published";

export type ProjectPostImage = ProjectGalleryPhoto & {
  alt: string;
  isHero: boolean;
  sortOrder: number;
};

export type ProjectPost = {
  bodyMarkdown: string;
  category: string;
  excerpt: string;
  heroImage: string;
  imageFolder: string;
  images: ProjectPostImage[];
  layoutVariant: ProjectLayoutVariant;
  likeCount: number;
  location: string;
  publishedAt: string | null;
  readingTimeMinutes: number;
  seoDescription: string;
  seoTitle: string;
  service: string;
  slug: string;
  status: ProjectPostStatus;
  title: string;
  updatedAt: string | null;
};

type ProjectPostSeed = {
  category: string;
  imageFolder: string;
  layoutVariant: ProjectLayoutVariant;
  location: string;
  markdownFile: string;
  publishedAt: string;
  service: string;
  slug: string;
  status: ProjectPostStatus;
};

type ProjectPostRow = {
  body_markdown: string;
  category: string;
  excerpt: string;
  hero_image: string;
  image_folder: string;
  layout_variant: ProjectLayoutVariant;
  like_count: number | null;
  location: string;
  published_at: Date | string | null;
  reading_time_minutes: number;
  seo_description: string;
  seo_title: string;
  service: string;
  slug: string;
  status: ProjectPostStatus;
  title: string;
  updated_at: Date | string | null;
};

type ProjectPostImageRow = {
  alt: string;
  category: string;
  is_hero: boolean;
  layout: string;
  location: string;
  sort_order: number;
  src: string;
};

const docsDirectory = path.join(process.cwd(), "public", "assets", "docs");
const projectsDirectory = path.join(
  process.cwd(),
  "public",
  "assets",
  "projects",
);

const imageExtensions = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);
const galleryLayouts = [
  "featured",
  "small",
  "wide",
  "small",
  "tall",
  "wide",
  "small",
  "small",
];

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

export function hasProjectPostsDatabase() {
  return Boolean(getDatabaseUrl());
}

function getSql() {
  const databaseUrl = getDatabaseUrl();

  return databaseUrl ? neon(databaseUrl) : null;
}

function toIsoString(value: Date | string | null) {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value.toISOString() : value;
}

function sortImageFiles(a: string, b: string) {
  const aNumber = Number.parseInt(path.parse(a).name, 10);
  const bNumber = Number.parseInt(path.parse(b).name, 10);

  if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
    return aNumber - bNumber;
  }

  return a.localeCompare(b);
}

export function calculateReadingTime(markdown: string) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_\-[\]()`]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return Math.max(1, Math.ceil(words.length / 220));
}

export function extractMarkdownTitle(markdown: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || "Project story";
}

export function stripMarkdownTitle(markdown: string) {
  return markdown.replace(/^#\s+.+\n+/, "").trim();
}

export function extractMarkdownExcerpt(markdown: string) {
  const body = stripMarkdownTitle(markdown);
  const paragraph = body
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .find((item) => item && !item.startsWith("#") && !item.startsWith("-"));

  if (!paragraph) {
    return "A closer look at the preparation, craft, and finish behind this PlasterPro Solution project.";
  }

  return paragraph.length > 178 ? `${paragraph.slice(0, 175).trim()}...` : paragraph;
}

function readMarkdownFile(markdownFile: string) {
  return fs.readFileSync(path.join(docsDirectory, markdownFile), "utf8");
}

function getProjectImageFiles(imageFolder: string) {
  const folderPath = path.join(projectsDirectory, imageFolder);

  if (!fs.existsSync(folderPath)) {
    return [];
  }

  return fs
    .readdirSync(folderPath)
    .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
    .sort(sortImageFiles);
}

export function getSeedProjectPostImages(seed: ProjectPostSeed) {
  return getProjectImageFiles(seed.imageFolder).map((file, index) => {
    const image = `/assets/projects/${seed.imageFolder}/${file}`;

    return {
      alt: `${seed.location} project photo ${index + 1}`,
      category: seed.category,
      image,
      isHero: index === 0,
      layout: galleryLayouts[index % galleryLayouts.length],
      location: seed.location,
      sortOrder: index,
      title: `${seed.location} ${seed.service} ${index + 1}`,
    } satisfies ProjectPostImage;
  });
}

export function getSeedProjectPosts() {
  return (projectPostSeeds as ProjectPostSeed[]).map((seed) => {
    const markdown = readMarkdownFile(seed.markdownFile);
    const title = extractMarkdownTitle(markdown);
    const bodyMarkdown = stripMarkdownTitle(markdown);
    const images = getSeedProjectPostImages(seed);

    return {
      bodyMarkdown,
      category: seed.category,
      excerpt: extractMarkdownExcerpt(markdown),
      heroImage: images[0]?.image || "/assets/projects/other-projects/freemans-bay-04.avif",
      imageFolder: seed.imageFolder,
      images,
      layoutVariant: seed.layoutVariant,
      likeCount: 0,
      location: seed.location,
      publishedAt: seed.publishedAt,
      readingTimeMinutes: calculateReadingTime(bodyMarkdown),
      seoDescription: extractMarkdownExcerpt(markdown),
      seoTitle: title,
      service: seed.service,
      slug: seed.slug,
      status: seed.status,
      title,
      updatedAt: null,
    } satisfies ProjectPost;
  });
}

function mapImageRow(row: ProjectPostImageRow): ProjectPostImage {
  return {
    alt: row.alt,
    category: row.category,
    image: row.src,
    isHero: row.is_hero,
    layout: row.layout,
    location: row.location,
    sortOrder: row.sort_order,
    title: row.alt,
  };
}

function mapPostRow(row: ProjectPostRow, images: ProjectPostImage[]): ProjectPost {
  return {
    bodyMarkdown: row.body_markdown,
    category: row.category,
    excerpt: row.excerpt,
    heroImage: row.hero_image,
    imageFolder: row.image_folder,
    images,
    layoutVariant: row.layout_variant,
    likeCount: row.like_count ?? 0,
    location: row.location,
    publishedAt: toIsoString(row.published_at),
    readingTimeMinutes: row.reading_time_minutes,
    seoDescription: row.seo_description,
    seoTitle: row.seo_title,
    service: row.service,
    slug: row.slug,
    status: row.status,
    title: row.title,
    updatedAt: toIsoString(row.updated_at),
  };
}

async function getDbImages(slug: string) {
  const sql = getSql();

  if (!sql) {
    return null;
  }

  const rows = (await sql`
    SELECT src, alt, category, location, layout, sort_order, is_hero
    FROM project_post_images
    WHERE post_slug = ${slug}
    ORDER BY sort_order ASC, id ASC
  `) as ProjectPostImageRow[];

  return rows.map(mapImageRow);
}

export async function getPublishedProjectPosts() {
  const sql = getSql();

  if (!sql) {
    return getSeedProjectPosts().filter((post) => post.status === "published");
  }

  try {
    const rows = (await sql`
      SELECT p.*, COALESCE(l.like_count, 0) AS like_count
      FROM project_posts p
      LEFT JOIN project_post_likes l ON l.post_slug = p.slug
      WHERE p.status = 'published'
      ORDER BY p.published_at DESC NULLS LAST, p.title ASC
    `) as ProjectPostRow[];

    return Promise.all(
      rows.map(async (row) => mapPostRow(row, await getDbImages(row.slug) ?? [])),
    );
  } catch {
    return getSeedProjectPosts().filter((post) => post.status === "published");
  }
}

export async function getProjectPost(slug: string) {
  const safeSlug = slug.toLowerCase();
  const sql = getSql();

  if (!sql) {
    return getSeedProjectPosts().find((post) => post.slug === safeSlug) ?? null;
  }

  try {
    const rows = (await sql`
      SELECT p.*, COALESCE(l.like_count, 0) AS like_count
      FROM project_posts p
      LEFT JOIN project_post_likes l ON l.post_slug = p.slug
      WHERE p.slug = ${safeSlug}
      LIMIT 1
    `) as ProjectPostRow[];

    const row = rows[0];

    if (!row) {
      return null;
    }

    return mapPostRow(row, await getDbImages(row.slug) ?? []);
  } catch {
    return getSeedProjectPosts().find((post) => post.slug === safeSlug) ?? null;
  }
}

export async function getProjectPostSlugs() {
  const posts = await getPublishedProjectPosts();

  return posts.map((post) => post.slug);
}

export function toProjectGalleryPhotos(post: ProjectPost): ProjectGalleryPhoto[] {
  return post.images.map((image) => ({
    category: image.category,
    image: image.image,
    layout: image.layout,
    location: image.location,
    title: image.title,
  }));
}

export async function getProjectLikeCount(slug: string) {
  const post = await getProjectPost(slug);

  return post?.likeCount ?? 0;
}

function hashVisitor(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function likeProjectPost(slug: string, visitorId: string) {
  const safeSlug = slug.toLowerCase();
  const sql = getSql();

  if (!sql) {
    return {
      alreadyLiked: false,
      count: 0,
      enabled: false,
      found: Boolean(await getProjectPost(safeSlug)),
    };
  }

  const post = await getProjectPost(safeSlug);

  if (!post) {
    return {
      alreadyLiked: false,
      count: 0,
      enabled: true,
      found: false,
    };
  }

  const visitorHash = hashVisitor(visitorId);
  const insertedEvents = (await sql`
    INSERT INTO project_post_like_events (post_slug, visitor_hash)
    VALUES (${safeSlug}, ${visitorHash})
    ON CONFLICT (post_slug, visitor_hash) DO NOTHING
    RETURNING id
  `) as Array<{ id: number }>;

  if (insertedEvents.length === 0) {
    return {
      alreadyLiked: true,
      count: post.likeCount,
      enabled: true,
      found: true,
    };
  }

  const rows = (await sql`
    INSERT INTO project_post_likes (post_slug, like_count, updated_at)
    VALUES (${safeSlug}, 1, NOW())
    ON CONFLICT (post_slug)
    DO UPDATE SET like_count = project_post_likes.like_count + 1, updated_at = NOW()
    RETURNING like_count
  `) as Array<{ like_count: number }>;

  return {
    alreadyLiked: false,
    count: rows[0]?.like_count ?? post.likeCount + 1,
    enabled: true,
    found: true,
  };
}
