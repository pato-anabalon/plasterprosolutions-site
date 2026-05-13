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
```

Static media lives in:

```txt
public/assets/
```

## Pages

- `/` - Home
- `/services` - Service overview
- `/about` - Company story, strengths, mission, qualifications, and team
- `/projects` - Project gallery
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

- Replaced the old `mailto:`-only behaviour with a quote request form that posts to a Next.js route handler.
- Added `/api/quote` for forwarding quote requests to a Zapier webhook.
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
- Added curated review highlights attributed to NoCowboys.
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

### Security Hardening

- Added global security headers in `next.config.ts`.
- Added a Content Security Policy with production and local-development variants.
- Disabled the `X-Powered-By` header.
- Added best-effort rate limiting to `/api/quote`.
- Added payload size limits, field length limits, phone validation, and stricter webhook URL validation.
- Added a timeout around the Zapier webhook request.
- Added Vercel Blob client uploads for quote request attachments before forwarding file URLs to Zapier.
- Added `noopener` to external review links.

## Environment Variables

The quote form expects this variable when the Zapier integration is ready:

```bash
ZAPIER_QUOTE_WEBHOOK_URL=
BLOB_READ_WRITE_TOKEN=
```

If `ZAPIER_QUOTE_WEBHOOK_URL` is not configured, the API route will return an error instead of silently losing quote requests. `BLOB_READ_WRITE_TOKEN` is required for the browser-to-Blob upload token route used by file attachments.

## Commands

```bash
npm run dev
npm run lint
npm run test
npm run test:watch
npm run test:coverage
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
- Ensure `ZAPIER_QUOTE_WEBHOOK_URL` is configured in Vercel before testing live quote submissions.
- Connect Vercel Blob to the project so `BLOB_READ_WRITE_TOKEN` is available in Production, Preview, and Development as needed.
- Quote file uploads use direct client uploads to avoid Vercel Function body-size limits.
- Quote file uploads accept JPG, PNG, WebP, HEIC, HEIF, and PDF files, up to 5 files, 10 MB each, and 25 MB total.
- Quote attachments are grouped in Blob paths such as `quote-requests/YYYY-MM-DD/first-last-address-a1b2c3/file.pdf`.
- Map the `fileUrls` and `uploadFolder` fields from Zapier into Quotient notes or attachment fields, depending on the Quotient Zap action options.

## Brand Notes

- Company name in user-facing copy: **PlasterPro Solution**.
- Main contact email: `sales@plasterprosolution.co.nz`.
- Current colour tokens are defined in `src/app/globals.css`.
- Logo assets are split by size and theme:
  - `logo-large-light.png`
  - `logo-large-dark.png`
  - `logo-short-light.png`
  - `logo-short-dark.png`
