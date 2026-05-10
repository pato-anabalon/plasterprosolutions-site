import Image from "next/image";
import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/data/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-surface/92 backdrop-blur-xl">
      <div className="grid min-h-20 grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-8 lg:grid-cols-[minmax(13rem,1fr)_auto_minmax(13rem,1fr)] lg:px-10 xl:px-12">
        <Link className="focus-ring inline-flex w-fit items-center justify-self-start" href="/" aria-label="PlasterProSolutions home">
          <Image
            className="h-auto w-[142px] sm:w-[162px]"
            src="/assets/ps_edited.png"
            alt="PlasterProSolutions"
            width={162}
            height={50}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 justify-self-center rounded-full border border-charcoal/10 bg-white/74 p-1 lg:flex" aria-label="Primary navigation">
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
            aria-label={`Call PlasterProSolutions at ${siteConfig.phone}`}
          >
            <Phone size={18} aria-hidden="true" />
          </a>
          <Button href="/contact">Request a Quote</Button>
        </div>

        <details className="group relative justify-self-end lg:hidden">
          <summary className="focus-ring grid size-11 cursor-pointer list-none place-items-center rounded-full border border-charcoal/15 bg-white text-charcoal [&::-webkit-details-marker]:hidden">
            <Menu size={20} aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </summary>
          <div className="absolute right-0 top-14 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-charcoal/10 bg-surface p-4 shadow-2xl">
            <nav className="grid gap-2" aria-label="Mobile navigation">
              {siteConfig.navigation.map((item) => (
                <Link
                  className="rounded-md px-3 py-3 text-base font-extrabold text-charcoal transition hover:bg-surface-strong"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
              <Button className="mt-2 w-full" href="/contact">
                Request a Quote
              </Button>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
