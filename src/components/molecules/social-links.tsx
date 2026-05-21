import { SocialIconLink } from "@/components/atoms/social-icon-link";
import type { SocialIconLabel } from "@/components/atoms/social-icon-link";
import { siteConfig } from "@/data/site";

type SocialLinksProps = {
  tone?: "dark" | "light";
  className?: string;
};

export function SocialLinks({ tone = "dark", className = "" }: SocialLinksProps) {
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      data-testid="social-links"
      aria-label="Social networks"
    >
      {siteConfig.socials.map((social) => (
        <SocialIconLink
          href={social.href}
          label={social.label as SocialIconLabel}
          key={social.href}
          tone={tone}
        />
      ))}
    </div>
  );
}
