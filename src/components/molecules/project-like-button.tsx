"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { track } from "@vercel/analytics";

type ProjectLikeButtonProps = {
  enabled: boolean;
  initialCount: number;
  slug: string;
  title: string;
};

export function ProjectLikeButton({
  enabled,
  initialCount,
  slug,
  title,
}: ProjectLikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);
  const storageKey = `plasterpro-project-like:${slug}`;
  const [liked, setLiked] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(storageKey) === "true",
  );

  async function handleLike() {
    if (!enabled || liked || isPending) {
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch(`/api/project-likes/${slug}`, {
        method: "POST",
      });
      const payload = (await response.json()) as {
        alreadyLiked?: boolean;
        count?: number;
      };

      if (response.ok) {
        setCount(payload.count ?? count);
        setLiked(true);
        window.localStorage.setItem(storageKey, "true");
        track("Project Like Clicked", {
          slug,
          title,
        });
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      aria-label={liked ? "Project liked" : "Like this project"}
      aria-pressed={liked}
      className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-extrabold text-foreground transition hover:border-spicy-orange hover:text-spicy-orange disabled:cursor-not-allowed disabled:opacity-55"
      disabled={!enabled || liked || isPending}
      onClick={handleLike}
      type="button"
    >
      <Heart
        aria-hidden="true"
        className={liked ? "fill-spicy-orange text-spicy-orange" : ""}
        size={18}
      />
      <span>{count}</span>
    </button>
  );
}
