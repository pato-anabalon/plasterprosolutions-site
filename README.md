# PlasterPro Solution Website

Marketing website for **PlasterPro Solution**, an Auckland-based plastering, painting, gib stopping, and real estate make-ready company.

The project is a modern rebuild of the previous site, focused on stronger visual direction, improved mobile/tablet responsiveness, richer motion, clearer service positioning, and a cleaner path for quote requests.

## Stack

- Next.js 16.2.6 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- GSAP with `@gsap/react`
- Lucide React icons
- Manrope via `@fontsource-variable/manrope`
- Vercel Analytics and Speed Insights
- Neon Postgres via `@neondatabase/serverless` for project stories and likes

## Project Structure

The UI follows an atomic design structure:

```txt
src/components/
  atoms/
  molecules/
  organisms/
  templates/
```

Shared content and structured business data live in:

```txt
src/data/site.ts
src/data/team.ts
src/data/terms.ts
src/data/project-post-seeds.json
```

Static media lives in:

```txt
public/assets/
public/assets/docs/
```

## Pages

- `/` - Home
- `/services` - Service overview
- `/about` - Company story, strengths, mission, qualifications, and team
- `/projects` - Editorial project story index
- `/projects/[slug]` - Individual project blog/case study
- `/real-estate` - Landing page for agents and property managers
- `/contact` - Quote request form and direct contact details
- `/terms-of-service` - Legal terms for plastering and painting services

## Main Improvements Implemented

### Visual System

- Switched typography to Manrope.
- Added responsive brand logo handling for light and dark themes.
- Added dark mode support with a manual theme toggle.
- Added dedicated footer logo behavior so the footer always uses the light logo.
- Added `shortcut-icon.png` favicon configuration.
- Refined desktop, tablet, and mobile header layouts.
- Added active desktop navigation indicator with hover transition.
- Improved inner page hero layouts so section pages feel less flat.

### Home Page

- Reworked the hero into a full-width panel layout inspired by editorial/interactive landing pages.
- Added hoverable hero panels for Work and Request a Quote.
- Added a floating scroll indicator.
- Added an interactive grid-style background treatment behind the hero logo.
- Rebuilt the service cards with hover auto-slide content on desktop.
- Added mobile and tablet-specific service card behavior.
- Redesigned project cards with stronger image contrast and internal image zoom on hover.
- Added a qualifications and partners marquee using square logo cards.
- Added customer review highlights sourced from NoCowboys.
- Updated the final CTA to use the spicy-orange brand colour.

### About Page

- Rebuilt About into a structured editorial page.
- Combined About and Team content into the About page.
- Added reusable components for proof strips, feature cards, statement cards, mission/vision, and team cards.
- Added team member profile cards using real team images and summarized bios.
- Preserved and redesigned the qualifications and partners section.

### Contact Page

- Replaced the old `mailto:`-only behaviour with the official embedded Quotient lead form.
- Preserved the custom quote form as hidden, noindex backup workflows at `/contact/direct-quotient-backup` and `/contact/zapier-backup`.
- Added `/api/quote` for the direct Quotient POST backup and `/api/quote/zapier` for the Zapier backup.
- Aligned form fields with the current Quotient form:
  - subject
  - message
  - first name
  - last name
  - email
  - company
  - address
  - phone
  - file upload placeholder
- Added direct contact cards for Rolando Reveco and Regan O'keefe.
- Added Terms of Service acknowledgement below the form.

### Reviews

- Added a reusable `CustomerReviewsSection`.
- Added `/api/customer-reviews` to load the latest NoCowboys reviews from the business ratings JSON endpoint.
- The live reviews flow filters for `100%` ratings and returns the latest three reviews.
- Added `CustomerReviewsLiveGrid` to render static fallback reviews first, then refresh from `/api/customer-reviews` every 10 minutes in the browser.
- Preserved static curated reviews in `src/data/site.ts` as the fallback if the NoCowboys request fails or returns no usable reviews.
- Preserved paragraph and line breaks from NoCowboys review text so longer comments remain readable.
- Added a fixed-height internal review text scroller to keep cards aligned while allowing full review text to be read.
- Desktop review text auto-scrolls slowly on hover or keyboard focus, while mobile keeps manual internal scrolling.
- Standardized review card heights and added a minimum title height so review body text starts at a consistent vertical position.
- Added NoCowboys logo and approval summary.
- Used a dark version on Home and a light version on Services to avoid blending into the footer.

### Legal

- Added `/terms-of-service`.
- Preserved legal text from the current PlasterPro Solution site without rewriting the content.
- Added a legal document renderer with a sticky section index.
- Added the Terms page to the footer and sitemap.
- Adjusted legal body typography to avoid `(c)` being rendered visually as a copyright symbol.

### Responsive Work

- Added mobile-specific header with centered logo.
- Added full-screen mobile/tablet menu animation.
- Added reusable social icon links for footer and menu.
- Hid duplicate hero logo on mobile and tablet.
- Adjusted hero panels on tablet so Work and Request a Quote sit side by side.
- Improved footer copyright wrapping on mobile.

### Deployment & Monitoring

- Configured Vercel Analytics.
- Configured Vercel Speed Insights.
- Added sitemap and robots routes.
- Prepared the site for Vercel deployment.

### Projects Blog

- Rebuilt Projects as an editorial case-study index.
- Added `/projects/[slug]` pages with SEO metadata, Article JSON-LD, breadcrumbs, reading time, share action, likes, CTA, and project galleries.
- Added Neon Postgres schema for editable project posts, project images, likes, and like events.
- Added Markdown seed support using the first 10 entries in `public/assets/docs`.
- Kept `ProjectMosaicGallery` unchanged and adapted project image data to its existing contract.
- Added `npm run seed:project-posts` to load the Markdown seeds into Neon.

### Security Hardening

- Added global security headers in `next.config.ts`.
- Added a Content Security Policy with production and local-development variants.
- Disabled the `X-Powered-By` header.
- Added best-effort rate limiting to `/api/quote`.
- Added payload size limits, field length limits, phone validation, and stricter webhook URL validation.
- Added a timeout around the Quotient and Zapier backup requests.
- Added Vercel Blob client uploads for quote request attachments before forwarding file URLs to Quotient.
- Added `noopener` to external review links.

## Environment Variables

The public contact form is embedded from Quotient and does not need local quote-form environment variables. Vercel Blob and Zapier are only needed for hidden backup workflows:

```bash
BLOB_READ_WRITE_TOKEN=
DATABASE_URL=
ZAPIER_QUOTE_WEBHOOK_URL=
```

`BLOB_READ_WRITE_TOKEN` is required for the custom backup form's browser-to-Blob upload token route. `ZAPIER_QUOTE_WEBHOOK_URL` is optional and only used by `/contact/zapier-backup`. `DATABASE_URL` is required for editable project posts and persistent project likes; without it, project pages fall back to the versioned Markdown seeds and the like button is disabled.

## Commands

```bash
npm run dev
npm run lint
npm run test
npm run test:watch
npm run test:coverage
npm run seed:project-posts
npm run build
npm run start
```

Husky runs `npm run test -- --runInBand` before each commit.

Local development usually runs on:

```txt
http://localhost:3000
```

If port `3000` is busy, Next.js may use `3001`.

## Deployment Notes

- Target platform: Vercel.
- Allow `https://www.quotientapp.com` in `frame-src` so the public `/contact` embed can load.
- Connect Vercel Blob to the project if either hidden custom quote form backup is used.
- The hidden `/contact/zapier-backup` route remains available only if `ZAPIER_QUOTE_WEBHOOK_URL` is configured.
- Quote file uploads use direct client uploads to avoid Vercel Function body-size limits.
- Quote file uploads accept JPG, PNG, WebP, HEIC, HEIF, and PDF files, up to 5 files, 10 MB each, and 25 MB total.
- Quote attachments are grouped in Blob paths such as `quote-requests/YYYY-MM-DD/first-last-address-a1b2c3/file.pdf`.
- The direct Quotient backup sends uploaded files as public Blob URLs appended to the lead message.
- Connect Neon Postgres to the Vercel project and run `npm run seed:project-posts` locally or from a trusted environment with `DATABASE_URL` available before relying on DB-backed project content.
- The customer reviews section depends on the public NoCowboys ratings JSON endpoint. If that endpoint changes or becomes unavailable, `/api/customer-reviews` falls back to `siteConfig.customerReviews` so the page still renders stable review cards.

## Brand Notes

- Company name in user-facing copy: **PlasterPro Solution**.
- Main contact email: `sales@plasterprosolution.co.nz`.
- Current colour tokens are defined in `src/app/globals.css`.
- Logo assets are split by size and theme:
  - `logo-large-light.png`
  - `logo-large-dark.png`
  - `logo-short-light.png`
  - `logo-short-dark.png`
