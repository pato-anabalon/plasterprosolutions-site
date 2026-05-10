import { Button } from "@/components/atoms/button";

type InnerPageHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export function InnerPageHero({ eyebrow, title, body }: InnerPageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal py-20 text-white sm:py-24">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(25,23,20,0.96)_0%,rgba(65,63,61,0.9)_55%,rgba(89,104,93,0.86)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-white/12" />
      <div className="site-shell grid gap-8 lg:grid-cols-[1fr_0.28fr] lg:items-end">
        <div className="max-w-4xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-spicy-orange">
            {eyebrow}
          </p>
          <h1 className="balanced mt-5 text-4xl font-black leading-tight sm:text-6xl">
            {title}
          </h1>
          <p className="pretty mt-6 max-w-3xl text-xl leading-9 text-white/72">{body}</p>
          <Button className="mt-8" href="/contact">
            Request a Quote
          </Button>
        </div>
        <div className="hidden justify-self-end lg:block">
          <div className="h-28 w-28 border-l border-t border-white/18" />
        </div>
      </div>
    </section>
  );
}
