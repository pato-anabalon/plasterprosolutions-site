type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  tone = "light",
}: SectionHeadingProps) {
  const titleColor = tone === "dark" ? "text-white" : "text-charcoal";
  const bodyColor = tone === "dark" ? "text-white/72" : "text-muted";

  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow ? (
        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.2em] text-spicy-orange">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`text-3xl font-black leading-tight sm:text-4xl lg:text-5xl ${titleColor}`}>
        {title}
      </h2>
      {body ? (
        <p className={`mt-5 text-lg leading-8 ${bodyColor}`}>{body}</p>
      ) : null}
    </div>
  );
}
