"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { track } from "@vercel/analytics";

type ProjectShareButtonProps = {
  slug: string;
  title: string;
};

export function ProjectShareButton({ slug, title }: ProjectShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/projects/${slug}`;
    await window.navigator.clipboard?.writeText(url);
    setCopied(true);
    track("Project Share Clicked", {
      slug,
      title,
    });
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-extrabold text-foreground transition hover:border-spicy-orange hover:text-spicy-orange"
      data-testid="project-share-button"
      onClick={handleCopy}
      type="button"
    >
      <Copy size={17} aria-hidden="true" />
      {copied ? "Copied" : "Share"}
    </button>
  );
}
