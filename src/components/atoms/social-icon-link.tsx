export type SocialIconLabel = "Facebook" | "Instagram" | "LinkedIn";

type SocialIconLinkProps = {
  href: string;
  label: SocialIconLabel;
  tone?: "dark" | "light";
  className?: string;
};

const socialIcons = {
  Facebook: (
    <path
      d="M14.2 8.1h2.5V4.2a31 31 0 0 0-3.6-.2c-3.6 0-6 2.2-6 6.2v3.5h-4v4.4h4V28h4.8v-9.9h3.8l.6-4.4h-4.4v-3.1c0-1.3.3-2.5 2.3-2.5Z"
      fill="currentColor"
    />
  ),
  Instagram: (
    <>
      <rect
        width="19"
        height="19"
        x="6.5"
        y="6.5"
        rx="5.2"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <circle cx="16" cy="16" r="4.5" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="21.8" cy="10.4" r="1.4" fill="currentColor" />
    </>
  ),
  LinkedIn: (
    <>
      <path
        d="M8 13h4.5v14H8V13Zm2.2-7a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2Z"
        fill="currentColor"
      />
      <path
        d="M15 13h4.3v1.9h.1c.6-1.1 2-2.3 4.2-2.3 4.5 0 5.4 3 5.4 6.8V27h-4.5v-6.8c0-1.6 0-3.7-2.3-3.7s-2.6 1.8-2.6 3.6V27H15V13Z"
        fill="currentColor"
      />
    </>
  ),
};

const tones = {
  dark: "border-white/12 bg-white/[0.03] text-white/66 hover:border-spicy-orange/55 hover:bg-spicy-orange/10 hover:text-spicy-orange",
  light:
    "border-charcoal/12 bg-white/80 text-charcoal/70 hover:border-spicy-orange/55 hover:bg-spicy-orange/10 hover:text-spicy-orange",
};

export function SocialIconLink({
  href,
  label,
  tone = "dark",
  className = "",
}: SocialIconLinkProps) {
  return (
    <a
      className={`focus-ring grid size-11 place-items-center rounded-full border transition duration-300 hover:-translate-y-0.5 ${tones[tone]} ${className}`}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`Open ${label}`}
    >
      <svg
        className="size-5"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {socialIcons[label]}
      </svg>
    </a>
  );
}
