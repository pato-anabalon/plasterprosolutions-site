import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const seedsPath = path.join(root, "src", "data", "project-post-seeds.json");
const schemaPath = path.join(root, "database", "project-posts.sql");
const docsDirectory = path.join(root, "public", "assets", "docs");
const projectsDirectory = path.join(root, "public", "assets", "projects");

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

function loadEnvFile(fileName) {
  const envPath = path.join(root, fileName);

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env.development.local");

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

function extractMarkdownTitle(markdown) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || "Project story";
}

function stripMarkdownTitle(markdown) {
  return markdown.replace(/^#\s+.+\n+/, "").trim();
}

function extractMarkdownExcerpt(markdown) {
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

function calculateReadingTime(markdown) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_\-[\]()`]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return Math.max(1, Math.ceil(words.length / 220));
}

function sortImageFiles(a, b) {
  const aNumber = Number.parseInt(path.parse(a).name, 10);
  const bNumber = Number.parseInt(path.parse(b).name, 10);

  if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
    return aNumber - bNumber;
  }

  return a.localeCompare(b);
}

function getProjectImages(seed) {
  return fs
    .readdirSync(path.join(projectsDirectory, seed.imageFolder))
    .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
    .sort(sortImageFiles)
    .map((file, index) => ({
      alt: `${seed.location} project photo ${index + 1}`,
      category: seed.category,
      isHero: index === 0,
      layout: galleryLayouts[index % galleryLayouts.length],
      location: seed.location,
      sortOrder: index,
      src: `/assets/projects/${seed.imageFolder}/${file}`,
    }));
}

async function runSchema(sql) {
  const statements = fs
    .readFileSync(schemaPath, "utf8")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement);
  }
}

async function main() {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL or POSTGRES_URL is required to seed project posts.");
  }

  const sql = neon(databaseUrl);
  const seeds = JSON.parse(fs.readFileSync(seedsPath, "utf8"));

  await runSchema(sql);

  for (const seed of seeds) {
    const markdown = fs.readFileSync(
      path.join(docsDirectory, seed.markdownFile),
      "utf8",
    );
    const title = extractMarkdownTitle(markdown);
    const bodyMarkdown = stripMarkdownTitle(markdown);
    const excerpt = extractMarkdownExcerpt(markdown);
    const images = getProjectImages(seed);
    const heroImage = images[0]?.src || "";

    await sql`
      INSERT INTO project_posts (
        slug,
        title,
        excerpt,
        body_markdown,
        location,
        service,
        category,
        hero_image,
        image_folder,
        layout_variant,
        seo_title,
        seo_description,
        status,
        reading_time_minutes,
        published_at,
        updated_at
      )
      VALUES (
        ${seed.slug},
        ${title},
        ${excerpt},
        ${bodyMarkdown},
        ${seed.location},
        ${seed.service},
        ${seed.category},
        ${heroImage},
        ${seed.imageFolder},
        ${seed.layoutVariant},
        ${title},
        ${excerpt},
        ${seed.status},
        ${calculateReadingTime(bodyMarkdown)},
        ${seed.publishedAt},
        NOW()
      )
      ON CONFLICT (slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        body_markdown = EXCLUDED.body_markdown,
        location = EXCLUDED.location,
        service = EXCLUDED.service,
        category = EXCLUDED.category,
        hero_image = EXCLUDED.hero_image,
        image_folder = EXCLUDED.image_folder,
        layout_variant = EXCLUDED.layout_variant,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description,
        status = EXCLUDED.status,
        reading_time_minutes = EXCLUDED.reading_time_minutes,
        published_at = EXCLUDED.published_at,
        updated_at = NOW()
    `;

    await sql`DELETE FROM project_post_images WHERE post_slug = ${seed.slug}`;

    for (const image of images) {
      await sql`
        INSERT INTO project_post_images (
          post_slug,
          src,
          alt,
          category,
          location,
          layout,
          sort_order,
          is_hero
        )
        VALUES (
          ${seed.slug},
          ${image.src},
          ${image.alt},
          ${image.category},
          ${image.location},
          ${image.layout},
          ${image.sortOrder},
          ${image.isHero}
        )
      `;
    }

    await sql`
      INSERT INTO project_post_likes (post_slug, like_count)
      VALUES (${seed.slug}, 0)
      ON CONFLICT (post_slug) DO NOTHING
    `;

    console.log(`Seeded ${seed.slug}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
