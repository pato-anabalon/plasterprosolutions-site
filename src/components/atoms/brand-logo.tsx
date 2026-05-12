import Image from "next/image";

type BrandLogoVariant = "large" | "short";

type BrandLogoProps = {
  alt?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  theme?: "auto" | "dark" | "light";
  variant?: BrandLogoVariant;
};

const logoConfig = {
  large: {
    aspect: "aspect-[1023/376]",
    darkMode: "/assets/logo-large-dark.png",
    height: 376,
    lightMode: "/assets/logo-large-light.png",
    width: 1023,
  },
  short: {
    aspect: "aspect-[1220/694]",
    darkMode: "/assets/logo-short-dark.png",
    height: 694,
    lightMode: "/assets/logo-short-light.png",
    width: 1220,
  },
};

export function BrandLogo({
  alt = "PlasterPro Solution",
  className = "",
  imageClassName = "",
  priority = false,
  sizes,
  theme = "auto",
  variant = "large",
}: BrandLogoProps) {
  const logo = logoConfig[variant];
  const resolvedSizes =
    sizes ?? (variant === "large" ? "(max-width: 640px) 10rem, 12rem" : "23rem");

  return (
    <span className={`relative block ${logo.aspect} ${className}`}>
      {theme === "auto" ? (
        <>
          <Image
            className={`theme-logo-light object-contain ${imageClassName}`}
            src={logo.lightMode}
            alt={alt}
            fill
            sizes={resolvedSizes}
            priority={priority}
          />
          <Image
            className={`theme-logo-dark object-contain ${imageClassName}`}
            src={logo.darkMode}
            alt=""
            fill
            sizes={resolvedSizes}
            priority={priority}
            aria-hidden="true"
          />
        </>
      ) : (
        <Image
          className={`object-contain ${imageClassName}`}
          src={theme === "dark" ? logo.darkMode : logo.lightMode}
          alt={alt}
          fill
          sizes={resolvedSizes}
          priority={priority}
        />
      )}
    </span>
  );
}
