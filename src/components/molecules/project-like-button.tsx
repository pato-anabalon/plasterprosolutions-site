"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { track } from "@vercel/analytics";

type ProjectLikeButtonProps = {
  enabled: boolean;
  initialCount: number;
  slug: string;
  title: string;
};

const minimumPendingTime = 520;

function wait(milliseconds: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export function ProjectLikeButton({
  enabled,
  initialCount,
  slug,
  title,
}: ProjectLikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
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
    const startedAt = window.performance.now();

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
        setShowBurst(true);
        window.localStorage.setItem(storageKey, "true");
        track("Project Like Clicked", {
          slug,
          title,
        });
      }
    } finally {
      const elapsed = window.performance.now() - startedAt;

      if (elapsed < minimumPendingTime) {
        await wait(minimumPendingTime - elapsed);
      }

      setIsPending(false);
    }
  }

  useEffect(() => {
    if (!showBurst) {
      return;
    }

    const timeout = window.setTimeout(() => setShowBurst(false), 950);

    return () => window.clearTimeout(timeout);
  }, [showBurst]);

  return (
    <button
      aria-label={liked ? "Project liked" : "Like this project"}
      aria-pressed={liked}
      className="focus-ring group relative inline-flex min-h-11 items-center gap-2 overflow-visible rounded-full border border-border bg-surface px-4 text-sm font-extrabold text-foreground transition hover:border-spicy-orange hover:text-spicy-orange disabled:cursor-not-allowed disabled:opacity-55"
      data-testid="project-like-button"
      disabled={!enabled || liked || isPending}
      onClick={handleLike}
      type="button"
    >
      <span
        className={`project-like-burst pointer-events-none absolute left-[1.55rem] top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full ${
          showBurst ? "is-active" : ""
        }`}
        data-testid="project-like-button-burst"
        aria-hidden="true"
      >
        <span className="project-like-burst-ring" />
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            className="project-like-burst-particle"
            key={index}
            style={
              {
                "--particle-angle": `${index * 45}deg`,
                "--particle-delay": `${index * 22}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </span>
      <Heart
        aria-hidden="true"
        className={`relative z-10 transition duration-300 ${
          liked ? "fill-spicy-orange text-spicy-orange" : ""
        } ${isPending ? "project-like-heart-pending text-spicy-orange" : ""} ${
          showBurst ? "project-like-heart-confirmed" : ""
        }`}
        data-testid="project-like-button-heart"
        size={18}
      />
      <span data-testid="project-like-button-count">{count}</span>
    </button>
  );
}
