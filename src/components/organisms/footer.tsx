import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";

const socialIcons = {
  Facebook: (
    <path
      d="M14.2 8.1h2.5V4.2a31 31 0 0 0-3.6-.2c-3.6 0-6 2.2-6 6.2v3.5h-4v4.4h4V28h4.8v-9.9h3.8l.6-4.4h-4.4v-3.1c0-1.3.3-2.5 2.3-2.5Z"
      fill="currentColor"
    />
  ),
  Instagram: (
    <>
      <rect
        width="19"
        height="19"
        x="6.5"
        y="6.5"
        rx="5.2"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <circle cx="16" cy="16" r="4.5" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="21.8" cy="10.4" r="1.4" fill="currentColor" />
    </>
  ),
  LinkedIn: (
    <>
      <path d="M8 13h4.5v14H8V13Zm2.2-7a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2Z" fill="currentColor" />
      <path d="M15 13h4.3v1.9h.1c.6-1.1 2-2.3 4.2-2.3 4.5 0 5.4 3 5.4 6.8V27h-4.5v-6.8c0-1.6 0-3.7-2.3-3.7s-2.6 1.8-2.6 3.6V27H15V13Z" fill="currentColor" />
    </>
  ),
};

export function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-charcoal text-white">
      <div className="site-shell grid gap-10 py-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <Image
            className="brightness-0 invert"
            src="/assets/ps_edited.png"
            alt="PlasterProSolutions"
            width={176}
            height={54}
          />
          <p className="mt-5 max-w-md text-base leading-7 text-white/70">
            Auckland plastering, painting, gib stopping, and property presentation specialists trusted by homeowners, builders, agents, and property managers.
          </p>
          <div className="mt-7 flex items-center gap-3" aria-label="Social networks">
            {siteConfig.socials.map((social) => (
              <a
                className="focus-ring grid size-11 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-white/66 transition duration-300 hover:-translate-y-0.5 hover:border-spicy-orange/55 hover:bg-spicy-orange/10 hover:text-spicy-orange"
                href={social.href}
                key={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Follow PlasterProSolutions on ${social.label}`}
              >
                <svg
                  className="size-5"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {socialIcons[social.label as keyof typeof socialIcons]}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-white/50">
            Contact
          </h2>
          <ul className="mt-5 grid gap-3 text-sm text-white/75">
            <li className="flex gap-3">
              <Phone size={18} aria-hidden="true" />
              <a className="hover:text-white" href={`tel:${siteConfig.phone.replaceAll(" ", "")}`}>
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={18} aria-hidden="true" />
              <a className="hover:text-white" href={`mailto:${siteConfig.email}`}>
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
          <nav className="mt-5 grid gap-2 text-sm text-white/75" aria-label="Footer navigation">
            {siteConfig.navigation.map((item) => (
              <Link className="hover:text-white" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs font-bold uppercase tracking-[0.14em] text-white/45">
        Copyright {new Date().getFullYear()} PlasterPro Solutions. Built with 💜 by Nodo.co.nz.
      </div>
    </footer>
  );
}
