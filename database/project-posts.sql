CREATE TABLE IF NOT EXISTS project_posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  location TEXT NOT NULL,
  service TEXT NOT NULL,
  category TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  image_folder TEXT NOT NULL,
  layout_variant TEXT NOT NULL CHECK (
    layout_variant IN ('feature-left', 'editorial-split', 'gallery-led')
  ),
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  reading_time_minutes INTEGER NOT NULL DEFAULT 1,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_post_images (
  id BIGSERIAL PRIMARY KEY,
  post_slug TEXT NOT NULL REFERENCES project_posts(slug) ON DELETE CASCADE,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  layout TEXT NOT NULL DEFAULT 'small',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_hero BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_slug, src)
);

CREATE TABLE IF NOT EXISTS project_post_likes (
  post_slug TEXT PRIMARY KEY REFERENCES project_posts(slug) ON DELETE CASCADE,
  like_count INTEGER NOT NULL DEFAULT 0 CHECK (like_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_post_like_events (
  id BIGSERIAL PRIMARY KEY,
  post_slug TEXT NOT NULL REFERENCES project_posts(slug) ON DELETE CASCADE,
  visitor_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_slug, visitor_hash)
);

CREATE INDEX IF NOT EXISTS project_posts_status_published_at_idx
  ON project_posts (status, published_at DESC);

CREATE INDEX IF NOT EXISTS project_post_images_post_slug_sort_idx
  ON project_post_images (post_slug, sort_order);
