import { AnimatedReveal } from "@/components/molecules/animated-reveal";

type PersonCardProps = {
  delay?: number;
  focus: string;
  name: string;
  role: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function PersonCard({
  delay = 0,
  focus,
  name,
  role,
}: PersonCardProps) {
  return (
    <AnimatedReveal
      className="group grid gap-5 rounded-lg border border-charcoal/10 bg-surface p-5 shadow-[0_18px_50px_rgba(25,23,20,0.06)] transition duration-300 hover:-translate-y-1 hover:border-spicy-orange/40 hover:bg-surface-strong sm:grid-cols-[auto_1fr]"
      delay={delay}
    >
      <div className="grid size-16 shrink-0 place-items-center rounded-full bg-charcoal text-xl font-black text-white transition duration-300 group-hover:bg-spicy-orange">
        {getInitials(name)}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-black text-charcoal">{name}</h3>
          <p className="rounded-full border border-spicy-orange/20 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-spicy-orange">
            {role}
          </p>
        </div>
        <p className="pretty mt-3 text-base font-bold leading-7 text-muted">
          {focus}
        </p>
      </div>
    </AnimatedReveal>
  );
}
