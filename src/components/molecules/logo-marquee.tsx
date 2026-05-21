import Image from "next/image";

type LogoMarqueeItem = {
  name: string;
  src: string;
};

type LogoMarqueeProps = {
  ariaLabel: string;
  items: LogoMarqueeItem[];
  size?: "compact" | "large";
};

export function LogoMarquee({
  ariaLabel,
  items,
  size = "compact",
}: LogoMarqueeProps) {
  const cardSize = size === "large" ? "size-40 sm:size-52" : "size-28 sm:size-36";
  const imageSizes =
    size === "large" ? "(max-width: 640px) 10rem, 13rem" : "(max-width: 640px) 7rem, 9rem";

  return (
    <div
      className="qualifications-marquee group relative -my-8 py-8"
      data-testid="logo-marquee"
    >
      <div
        className="qualifications-marquee-track flex w-max items-center"
        data-testid="logo-marquee-track"
        aria-label={ariaLabel}
      >
        {[0, 1].map((setIndex) => (
          <div
            className="qualifications-marquee-set flex items-center gap-6 pr-6"
            data-testid="logo-marquee-set"
            key={setIndex}
            aria-hidden={setIndex === 1}
          >
            {items.map((item) => (
              <div
                className={`qualification-logo-card group/card relative grid shrink-0 place-items-center overflow-hidden rounded-md border border-white/12 bg-white shadow-[0_18px_48px_rgba(0,0,0,0.18)] transition-colors duration-300 ${cardSize}`}
                data-testid="logo-marquee-item"
                key={`${item.name}-${setIndex}`}
                title={item.name}
              >
                <Image
                  className="object-cover opacity-70 grayscale transition duration-500 ease-out group-hover/card:scale-105 group-hover/card:opacity-100 group-hover/card:grayscale-0"
                  data-testid="logo-marquee-image"
                  src={item.src}
                  alt={setIndex === 0 ? item.name : ""}
                  fill
                  sizes={imageSizes}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
