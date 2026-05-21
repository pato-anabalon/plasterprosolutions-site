import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/atoms/brand-logo";
import { SocialLinks } from "@/components/molecules/social-links";
import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer
      className="border-t border-charcoal/10 bg-charcoal text-white"
      data-testid="site-footer"
    >
      <div
        className="site-shell grid gap-10 py-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr]"
        data-testid="site-footer-grid"
      >
        <div data-testid="site-footer-brand">
          <BrandLogo className="w-44" theme="dark" />
          <p className="mt-5 max-w-md text-base leading-7 text-white/70">
            Auckland plastering, painting, gib stopping, and property
            presentation specialists trusted by homeowners, builders, agents,
            and property managers.
          </p>
          <SocialLinks className="mt-7" />
        </div>

        <div data-testid="site-footer-contact">
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-white/50">
            Contact
          </h2>
          <ul className="mt-5 grid gap-3 text-sm text-white/75">
            <li className="flex gap-3">
              <Phone size={18} aria-hidden="true" />
              <a
                className="hover:text-white"
                href={`tel:${siteConfig.phone.replaceAll(" ", "")}`}
              >
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={18} aria-hidden="true" />
              <a
                className="hover:text-white"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin size={18} aria-hidden="true" />
              <span>{siteConfig.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-white/50">
            Explore
          </h2>
          <nav
            className="mt-5 grid gap-2 text-sm text-white/75"
            data-testid="site-footer-navigation"
            aria-label="Footer navigation"
          >
            {siteConfig.navigation.map((item) => (
              <Link
                className="hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link className="hover:text-white" href="/terms-of-service">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
      <div
        className="border-t border-white/10 py-5 text-center text-xs font-bold uppercase tracking-[0.14em] text-white/45"
        data-testid="site-footer-copyright"
      >
        <span>Copyright {new Date().getFullYear()} PlasterPro Solution.</span>
        <span className="mt-2 block sm:mt-0 sm:inline">
          {" "}
          Built with 💜 by Nodo.co.nz
        </span>
      </div>
    </footer>
  );
}
