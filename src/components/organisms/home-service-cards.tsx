'use client';

import Link from 'next/link';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { AnimatedReveal } from '@/components/molecules/animated-reveal';

type Service = {
  title: string;
  slug: string;
  description: string;
  bestFor: string;
  includes: string[];
};

type HomeServiceCardsProps = {
  services: Service[];
};

export function HomeServiceCards({ services }: HomeServiceCardsProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <div className="mt-12 grid gap-3 sm:hidden">
        {services.map((service, index) => {
          const isOpen = openIndex === index;
          const panelId = `home-service-panel-${service.slug}`;

          return (
            <AnimatedReveal
              className={`relative overflow-hidden rounded-lg border transition duration-300 ${
                isOpen ? 'border-charcoal bg-charcoal text-white' : 'border-charcoal/10 bg-surface text-charcoal'
              }`}
              key={service.slug}
              delay={index * 0.04}
            >
              <span
                className={`pointer-events-none absolute -right-2 top-4 text-[5.75rem] font-black leading-none transition duration-300 ${
                  isOpen ? 'text-white/10' : 'text-charcoal/[0.06]'
                }`}
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <button
                className="focus-ring relative z-10 grid w-full gap-8 p-6 text-left"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(index)}
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-spicy-orange">Service</span>
                  <span
                    className={`grid size-10 place-items-center rounded-full border transition ${
                      isOpen ? 'border-white/14 bg-white/8 text-white' : 'border-charcoal/12 bg-white text-charcoal'
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </span>
                <span className="grid gap-4">
                  <span className="balanced block max-w-[15rem] text-3xl font-black leading-[0.98]">
                    {service.title}
                  </span>
                  <span className={`pretty block text-base leading-7 ${isOpen ? 'text-white/72' : 'text-muted'}`}>
                    {service.description}
                  </span>
                </span>
              </button>
              <div
                className={`relative z-10 grid overflow-hidden transition-all duration-500 ease-out ${
                  isOpen ? 'max-h-[34rem] opacity-100' : 'max-h-0 opacity-0'
                }`}
                id={panelId}
              >
                <div className="grid gap-5 border-t border-white/10 px-6 pb-6 pt-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-spicy-orange">Best for</p>
                    <p className="pretty mt-2 text-base leading-7 text-white/72">{service.bestFor}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-spicy-orange">Includes</p>
                    <ul className="mt-3 grid gap-2 text-sm font-bold leading-6 text-white/72">
                      {service.includes.slice(0, 3).map((item) => (
                        <li className="flex gap-3" key={item}>
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-spicy-orange" aria-hidden="true" />
                          {item}
                        </li>
                      ))}

                      <li className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-spicy-orange" aria-hidden="true" />
                        and more...
                      </li>
                    </ul>
                  </div>
                  <Link
                    className="focus-ring inline-flex w-fit items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-spicy-orange"
                    href={`/services#${service.slug}`}
                  >
                    Explore service <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </AnimatedReveal>
          );
        })}
      </div>

      <div className="mt-12 hidden grid-cols-2 gap-4 sm:grid lg:hidden">
        {services.map((service, index) => (
          <AnimatedReveal
            className="group relative overflow-hidden rounded-lg border border-charcoal/10 bg-surface shadow-[0_18px_54px_rgba(25,23,20,0.08)] transition duration-300 hover:-translate-y-1 hover:border-spicy-orange/35 hover:shadow-[0_22px_60px_rgba(227,65,15,0.12)]"
            key={service.slug}
            delay={index * 0.04}
          >
            <Link
              className="focus-ring relative flex min-h-[23rem] flex-col justify-between p-6 text-charcoal"
              href={`/services#${service.slug}`}
              aria-label={`Explore ${service.title}`}
            >
              <span
                className="pointer-events-none absolute -right-4 top-5 text-[7.5rem] font-black leading-none text-charcoal/[0.055] transition duration-300 group-hover:text-spicy-orange/[0.08]"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="relative z-10 flex items-center justify-between gap-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-spicy-orange">Service</span>
                <span className="grid size-10 place-items-center rounded-full border border-charcoal/10 bg-white text-charcoal/40 transition duration-300 group-hover:border-spicy-orange/40 group-hover:text-spicy-orange">
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </span>
              <span className="relative z-10 mt-auto grid gap-5">
                <h3 className="balanced max-w-[15rem] text-3xl font-black leading-[0.98]">{service.title}</h3>
                <p className="pretty max-w-[24rem] text-base font-medium leading-7 text-muted">{service.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-spicy-orange">
                  Explore service <ArrowRight size={16} aria-hidden="true" />
                </span>
              </span>
            </Link>
          </AnimatedReveal>
        ))}
      </div>

      <div className="mt-12 hidden overflow-hidden rounded-lg border border-charcoal/10 bg-charcoal/10 lg:grid lg:grid-cols-4">
        {services.map((service, index) => (
          <AnimatedReveal
            className="service-card group relative min-h-[32rem] overflow-hidden bg-surface transition duration-500 hover:z-10 hover:-translate-y-1 hover:bg-charcoal focus-within:z-10 focus-within:-translate-y-1 focus-within:bg-charcoal"
            key={service.slug}
            delay={index * 0.04}
          >
            <Link
              className="focus-ring relative flex min-h-[32rem] flex-col p-6 text-charcoal transition duration-500 group-hover:text-white group-focus-within:text-white"
              href={`/services#${service.slug}`}
              aria-label={`Explore ${service.title}`}
            >
              <span
                className="pointer-events-none absolute -right-3 top-4 text-[6.5rem] font-black leading-none text-charcoal/[0.06] transition duration-500 group-hover:text-white/10 group-focus-within:text-white/10 sm:text-[7.5rem] lg:text-[6.5rem] xl:text-[7.25rem]"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="relative z-10 flex items-center justify-between gap-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-spicy-orange">Service</span>
                <ArrowRight
                  className="text-charcoal/30 transition duration-300 group-hover:translate-x-1 group-hover:text-spicy-orange group-focus-within:translate-x-1 group-focus-within:text-spicy-orange"
                  size={20}
                  aria-hidden="true"
                />
              </span>
              <span className="relative z-20 mt-auto grid gap-5">
                <h3 className="balanced max-w-[13rem] text-2xl font-black leading-tight transition duration-500 group-hover:text-white group-focus-within:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                  {service.title}
                </h3>
                <span className="service-card-copy-track block max-h-0 overflow-hidden border-t border-white/10 pt-0 opacity-0 transition-all duration-500 ease-out group-hover:max-h-52 group-hover:pt-7 group-hover:opacity-100 group-focus-within:max-h-52 group-focus-within:pt-7 group-focus-within:opacity-100">
                  <span className="relative block h-40">
                    <span className="service-card-copy-slide pretty absolute inset-0 block text-base leading-7 text-white/76">
                      {service.description}
                    </span>
                    <span className="service-card-copy-slide pretty absolute inset-0 block text-base leading-7 text-white/76">
                      <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-spicy-orange">
                        Best for
                      </span>
                      {service.bestFor}
                    </span>
                    <span className="service-card-copy-slide pretty absolute inset-0 block text-base leading-7 text-white/76">
                      <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-spicy-orange">
                        Includes
                      </span>
                      {service.includes
                        .slice(0, 3)
                        .join(' / ')
                        .concat(service.includes.length > 4 ? ' and more...' : '')}
                    </span>
                  </span>
                </span>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-spicy-orange">
                  Explore service <ArrowRight size={16} aria-hidden="true" />
                </span>
              </span>
            </Link>
          </AnimatedReveal>
        ))}
      </div>
    </>
  );
}
