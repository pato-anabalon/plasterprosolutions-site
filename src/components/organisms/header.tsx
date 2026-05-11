"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { SocialLinks } from "@/components/molecules/social-links";
import { siteConfig } from "@/data/site";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const mobileMenu = (
    <div
      className={`fixed inset-x-0 bottom-0 top-20 z-30 overflow-hidden bg-charcoal text-white transition duration-500 ease-out lg:hidden ${
        isMobileMenuOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-100"
      }`}
      id="mobile-menu"
      aria-hidden={!isMobileMenuOpen}
    >
      <div className="flex min-h-full flex-col justify-between px-6 pb-8 pt-7">
        <nav className="grid" aria-label="Mobile and tablet navigation">
          {siteConfig.navigation.map((item, index) => (
            <Link
              className={`flex items-end justify-between gap-5 border-b border-white/10 py-4 text-4xl font-black leading-none text-white transition duration-300 ease-out ${
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0"
              }`}
              href={item.href}
              key={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                transitionDelay: isMobileMenuOpen
                  ? `${150 + index * 45}ms`
                  : "0ms",
              }}
            >
              {item.label}
              <span className="text-xs font-black uppercase tracking-[0.18em] text-spicy-orange">
                {String(index + 1).padStart(2, "0")}
              </span>
            </Link>
          ))}
        </nav>
        <div
          className={`transition duration-300 ease-out ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
          style={{
            transitionDelay: isMobileMenuOpen ? "430ms" : "0ms",
          }}
        >
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
            Social networks
          </p>
          <SocialLinks className="mt-4" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-surface/92 backdrop-blur-xl">
      <div className="grid min-h-20 grid-cols-[2.75rem_1fr_2.75rem] items-center gap-4 px-5 sm:px-8 lg:grid-cols-[minmax(13rem,1fr)_auto_minmax(13rem,1fr)] lg:px-10 xl:px-12">
        <span className="h-11 lg:hidden" aria-hidden="true" />
        <Link
          className="focus-ring col-start-2 inline-flex w-fit items-center justify-self-center lg:col-start-auto lg:justify-self-start"
          href="/"
          aria-label="PlasterPro Solution home"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Image
            className="h-auto w-[142px] sm:w-[162px]"
            src="/assets/ps_edited.png"
            alt="PlasterPro Solution"
            width={162}
            height={50}
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-1 justify-self-center rounded-full border border-charcoal/10 bg-white/74 p-1 lg:flex"
          aria-label="Primary navigation"
        >
          {siteConfig.navigation.map((item) => (
            <Link
              className="focus-ring rounded-full px-3 py-2 text-sm font-extrabold text-charcoal/72 transition hover:bg-surface-strong hover:text-charcoal"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-self-end gap-3 lg:flex">
          <a
            className="focus-ring inline-flex size-12 items-center justify-center rounded-full border border-charcoal/12 bg-white text-charcoal transition hover:border-spicy-orange hover:text-spicy-orange"
            href={`tel:${siteConfig.phone.replaceAll(" ", "")}`}
            aria-label={`Call PlasterPro Solution at ${siteConfig.phone}`}
          >
            <Phone size={18} aria-hidden="true" />
          </a>
          <Button href="/contact">Request a Quote</Button>
        </div>

        <div className="col-start-3 justify-self-end lg:hidden">
          <button
            className="focus-ring relative z-50 grid size-11 place-items-center rounded-full border border-charcoal/15 bg-white text-charcoal transition hover:border-spicy-orange hover:text-spicy-orange"
            type="button"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            {isMobileMenuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>

        </div>
      </header>
      {mobileMenu}
    </>
  );
}
