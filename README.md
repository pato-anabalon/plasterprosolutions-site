# PlasterProSolutions Website

Next.js website for PlasterProSolutions, an Auckland-based plastering, painting, gib stopping, and real estate make-ready company.

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS 4
- GSAP with `@gsap/react`
- Atomic design component structure
- Josefin Sans via `@fontsource-variable/josefin-sans`

## Commands

```bash
npm run dev
npm run build
npm run lint
```

## Notes

- Static assets rescued from the old Wix site live in `public/assets`.
- The current contact form uses a `mailto:` fallback to `sales@plasterprosolution.co.nz`.
- Before production launch on Vercel, replace the fallback with an email provider integration such as Resend or SMTP through a Next.js route handler.
