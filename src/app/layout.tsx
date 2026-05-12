import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/organisms/footer";
import { Header } from "@/components/organisms/header";
import { SitePreloader } from "@/components/organisms/site-preloader";
import { siteConfig } from "@/data/site";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "PlasterProSolution | Auckland Plastering & Painting Specialists",
    template: "%s | PlasterProSolution",
  },
  description:
    "Auckland-based plastering, painting, gib stopping, and real estate make-ready specialists for residential and commercial properties.",
  keywords: [
    "plastering Auckland",
    "painting Auckland",
    "gib stopping Auckland",
    "commercial plastering Auckland",
    "residential plastering Auckland",
    "real estate property maintenance Auckland",
  ],
  openGraph: {
    title: "PlasterProSolution",
    description:
      "Premium plastering, painting, and property presentation services across Auckland.",
    url: siteConfig.url,
    siteName: "PlasterProSolution",
    locale: "en_NZ",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/assets/shortcut-icon.png",
    shortcut: "/assets/shortcut-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "only light",
  themeColor: "#fffdfa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "Auckland",
      addressCountry: "NZ",
    },
    areaServed: "Auckland, New Zealand",
    serviceType: siteConfig.services.map((service) => service.title),
  };

  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col">
        <SitePreloader />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
