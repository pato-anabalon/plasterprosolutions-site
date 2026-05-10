type MediaPlaceholderProps = {
  label: string;
  aspect?: string;
};

export function MediaPlaceholder({
  label,
  aspect = "aspect-[4/3]",
}: MediaPlaceholderProps) {
  return (
    <div
      className={`${aspect} grid place-items-center rounded-lg border border-dashed border-charcoal/20 bg-concrete/60 p-6 text-center text-sm font-bold text-charcoal/55`}
    >
      {label}
    </div>
  );
}
