type HighlightStatProps = {
  label: string;
  value: string;
};

export function HighlightStat({ label, value }: HighlightStatProps) {
  return (
    <div
      className="rounded-lg border border-charcoal/10 bg-surface px-5 py-6 shadow-[0_18px_54px_rgba(25,23,20,0.06)]"
      data-testid="highlight-stat"
    >
      <p
        className="text-4xl font-black leading-none text-spicy-orange sm:text-5xl"
        data-testid="highlight-stat-value"
      >
        {value}
      </p>
      <p
        className="mt-3 text-sm font-extrabold uppercase tracking-[0.12em] text-charcoal/68"
        data-testid="highlight-stat-label"
      >
        {label}
      </p>
    </div>
  );
}
