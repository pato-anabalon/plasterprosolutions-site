import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "dark" | "ghost";
  className?: string;
} & ComponentPropsWithoutRef<"button">;

const variants = {
  primary:
    "bg-spicy-orange text-white shadow-[0_18px_48px_rgba(227,65,15,0.28)] hover:-translate-y-0.5 hover:bg-charcoal-brown hover:shadow-[0_18px_54px_rgba(65,63,61,0.22)]",
  secondary:
    "border border-charcoal/15 bg-surface text-charcoal shadow-[0_12px_34px_rgba(25,23,20,0.08)] hover:-translate-y-0.5 hover:border-spicy-orange hover:text-spicy-orange",
  dark:
    "border border-charcoal bg-charcoal text-white shadow-[0_18px_48px_rgba(25,23,20,0.18)] hover:-translate-y-0.5 hover:border-spicy-orange hover:bg-surface hover:text-foreground",
  ghost: "text-charcoal hover:-translate-y-0.5 hover:text-spicy-orange",
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const classes = `focus-ring inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full px-5 text-sm font-extrabold uppercase tracking-[0.08em] transition duration-300 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
