import { Star } from "lucide-react";

type ReviewCardProps = {
  body: string;
  date: string;
  name: string;
  rating: string;
  title: string;
  tone?: "dark" | "light";
};

export function ReviewCard({
  body,
  date,
  name,
  rating,
  title,
  tone = "dark",
}: ReviewCardProps) {
  const isDark = tone === "dark";
  const cardClasses = isDark
    ? "border-white/12 bg-white/[0.055] text-white shadow-[0_22px_70px_rgb(0_0_0/0.2)] hover:border-spicy-orange/70 hover:bg-white/[0.075]"
    : "border-charcoal/10 bg-surface text-charcoal shadow-[0_22px_70px_rgb(25_23_20/0.08)] hover:border-spicy-orange/60 hover:shadow-[0_28px_80px_rgb(25_23_20/0.12)]";
  const bodyClasses = isDark ? "text-white/70" : "text-muted";
  const ratingClasses = isDark
    ? "border-white/12 bg-white/8"
    : "border-charcoal/10 bg-charcoal/5";
  const footerClasses = isDark ? "border-white/12" : "border-charcoal/10";
  const metaClasses = isDark ? "text-white/48" : "text-muted";

  return (
    <article
      className={`group relative flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-lg border p-6 transition duration-300 hover:-translate-y-1 ${cardClasses}`}
      data-testid="review-card"
    >
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-spicy-orange transition duration-500 group-hover:scale-x-100" />
      <div>
        <div className="flex items-center justify-between gap-4">
          <div
            className="flex gap-1 text-spicy-orange"
            data-testid="review-card-stars"
            aria-hidden="true"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star className="fill-current" key={index} size={16} />
            ))}
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-black ${ratingClasses}`}
            data-testid="review-card-rating"
          >
            {rating}
          </span>
        </div>

        <h3
          className="balanced mt-8 text-2xl font-black leading-tight"
          data-testid="review-card-title"
        >
          {title}
        </h3>
        <p
          className={`pretty mt-4 text-base font-bold leading-7 ${bodyClasses}`}
          data-testid="review-card-body"
        >
          {body}
        </p>
      </div>

      <footer className={`mt-8 border-t pt-4 ${footerClasses}`} data-testid="review-card-footer">
        <p className="text-sm font-black">{name}</p>
        <p
          className={`mt-1 text-xs font-extrabold uppercase tracking-[0.16em] ${metaClasses}`}
        >
          NoCowboys · {date}
        </p>
      </footer>
    </article>
  );
}
