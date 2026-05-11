import Image from "next/image";

type StaggeredImage = {
  alt: string;
  className?: string;
  height: number;
  src: string;
  width: number;
};

type StaggeredImagePairProps = {
  primary: StaggeredImage;
  secondary: StaggeredImage;
};

export function StaggeredImagePair({
  primary,
  secondary,
}: StaggeredImagePairProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-[0.75fr_1fr]">
      <div className="overflow-hidden rounded-lg bg-charcoal sm:translate-y-10">
        <Image
          className={`aspect-[4/5] h-full w-full object-cover opacity-90 ${primary.className ?? ""}`}
          src={primary.src}
          alt={primary.alt}
          width={primary.width}
          height={primary.height}
        />
      </div>
      <div className="overflow-hidden rounded-lg bg-charcoal">
        <Image
          className={`aspect-[4/5] h-full w-full object-cover opacity-90 ${secondary.className ?? ""}`}
          src={secondary.src}
          alt={secondary.alt}
          width={secondary.width}
          height={secondary.height}
        />
      </div>
    </div>
  );
}
