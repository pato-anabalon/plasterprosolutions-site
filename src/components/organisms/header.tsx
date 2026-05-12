"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { BrandLogo } from "@/components/atoms/brand-logo";
import { Button } from "@/components/atoms/button";
import { SocialLinks } from "@/components/molecules/social-links";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { siteConfig } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const navIndicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [highlightedHref, setHighlightedHref] = useState<string | null>(null);

  const activeHref =
    siteConfig.navigation.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
    )?.href ?? "/";

  const moveNavIndicator = useCallback((href: string) => {
    const nav = navRef.current;
    const indicator = navIndicatorRef.current;
    const target = linkRefs.current[href];

    if (!nav || !indicator || !target) {
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    indicator.style.left = `${targetRect.left - navRect.left}px`;
    indicator.style.width = `${targetRect.width}px`;
    indicator.style.opacity = "1";
  }, []);

  useLayoutEffect(() => {
    moveNavIndicator(activeHref);
  }, [activeHref, moveNavIndicator]);

  useEffect(() => {
    const handleResize = () => moveNavIndicator(activeHref);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeHref, moveNavIndicator]);

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
          className={`flex items-end justify-between gap-6 transition duration-300 ease-out ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
          style={{
            transitionDelay: isMobileMenuOpen ? "430ms" : "0ms",
          }}
        >
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-white/45">
              Theme
            </p>
            <ThemeToggle tone="dark" />
          </div>
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
              Social networks
            </p>
            <SocialLinks className="mt-4 justify-end" />
          </div>
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
          className="focus-ring col-start-2 inline-flex w-fit items-center justify-self-center transition lg:col-start-auto lg:justify-self-start"
          href="/"
          aria-label="PlasterPro Solution home"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <BrandLogo className="w-[142px] sm:w-[162px]" priority />
        </Link>

        <nav
          className="relative hidden items-center gap-1 justify-self-center rounded-full border border-charcoal/10 bg-surface/78 p-1 lg:flex"
          aria-label="Primary navigation"
          ref={navRef}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setHighlightedHref(null);
              moveNavIndicator(activeHref);
            }
          }}
          onMouseLeave={() => {
            setHighlightedHref(null);
            moveNavIndicator(activeHref);
          }}
        >
          <span
            className="pointer-events-none absolute bottom-1 top-1 rounded-full bg-charcoal-brown shadow-[0_10px_28px_rgba(65,63,61,0.18)] transition-[left,width,opacity] duration-300 ease-out"
            ref={navIndicatorRef}
            style={{ left: 0, opacity: 0, width: 0 }}
            aria-hidden="true"
          />
          {siteConfig.navigation.map((item) => (
            <Link
              className={`focus-ring relative z-10 rounded-full px-3 py-2 text-sm font-extrabold transition duration-300 ${
                item.href === (highlightedHref ?? activeHref)
                  ? "text-white"
                  : item.href === activeHref
                    ? "text-spicy-orange"
                  : "text-charcoal/72 hover:text-white focus:text-white"
              }`}
              href={item.href}
              key={item.href}
              ref={(node) => {
                linkRefs.current[item.href] = node;
              }}
              aria-current={item.href === activeHref ? "page" : undefined}
              onFocus={() => {
                setHighlightedHref(item.href);
                moveNavIndicator(item.href);
              }}
              onMouseEnter={() => {
                setHighlightedHref(item.href);
                moveNavIndicator(item.href);
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-self-end gap-3 lg:flex">
          <ThemeToggle />
          <a
            className="focus-ring inline-flex size-12 items-center justify-center rounded-full border border-charcoal/12 bg-surface text-charcoal transition hover:border-spicy-orange hover:text-spicy-orange"
            href={`tel:${siteConfig.phone.replaceAll(" ", "")}`}
            aria-label={`Call PlasterPro Solution at ${siteConfig.phone}`}
          >
            <Phone size={18} aria-hidden="true" />
          </a>
          <Button href="/contact">Request a Quote</Button>
        </div>

        <div className="col-start-3 justify-self-end lg:hidden">
          <button
            className="focus-ring relative z-50 grid size-11 place-items-center rounded-full border border-charcoal/15 bg-surface text-charcoal transition hover:border-spicy-orange hover:text-spicy-orange"
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
