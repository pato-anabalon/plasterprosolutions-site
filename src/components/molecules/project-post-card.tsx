"use client";

import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import type { ProjectPost } from "@/lib/project-posts";

type ProjectPostCardProps = {
  featured?: boolean;
  post: ProjectPost;
};

function formatPublishedAge(value: string | null) {
  if (!value) {
    return "Recently published";
  }

  const publishedAt = new Date(value).getTime();

  if (Number.isNaN(publishedAt)) {
    return "Recently published";
  }

  const days = Math.max(
    0,
    Math.floor((Date.now() - publishedAt) / (1000 * 60 * 60 * 24)),
  );

  if (days === 0) {
    return "Today";
  }

  if (days === 1) {
    return "1 day ago";
  }

  return `${days} days ago`;
}

export function ProjectPostCard({ featured = false, post }: ProjectPostCardProps) {
  return (
    <article
      className={
        featured
          ? "group h-full min-h-[34rem] overflow-hidden rounded-lg bg-charcoal text-white shadow-[0_18px_48px_rgb(25_23_20/0.1)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_34px_90px_rgb(227_65_15/0.22)]"
          : "group h-full min-h-[30rem] overflow-hidden rounded-lg bg-charcoal text-white shadow-[0_18px_48px_rgb(25_23_20/0.1)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_34px_90px_rgb(227_65_15/0.18)]"
      }
    >
      <Link
        aria-label={`Read project story: ${post.title}`}
        className="focus-ring relative flex h-full overflow-hidden"
        href={`/projects/${post.slug}`}
        onClick={() => {
          track("Project Card Clicked", {
            slug: post.slug,
            title: post.title,
          });
        }}
      >
        <Image
          alt={post.title}
          className="scale-[1.3] object-cover transition duration-700 ease-out group-hover:scale-[1.36] group-focus-visible:scale-[1.36]"
          fill
          sizes={
            featured
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 1024px) 100vw, 33vw"
          }
          src={post.heroImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(25_23_20/0.02)_0%,rgb(25_23_20/0.08)_34%,rgb(25_23_20/0.82)_100%)]" />

        <span className="absolute left-4 top-4 rounded-full border border-white/18 bg-white/88 px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.1em] text-[#191714] shadow-[0_10px_28px_rgb(25_23_20/0.16)] backdrop-blur-md">
          {post.location}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-2">
          <div className="flex min-h-[13rem] flex-col rounded-lg border border-white/14 bg-charcoal/28 p-4 text-white shadow-[0_24px_70px_rgb(0_0_0/0.28)] backdrop-blur-xl sm:min-h-[13.5rem] sm:p-5">
          <h2
            className={
              featured
                ? "text-[length:var(--text-3xl)] font-black leading-tight text-white sm:text-[length:var(--text-4xl)]"
                : "text-[length:var(--text-xl)] font-black leading-tight text-white"
            }
          >
            {post.title}
          </h2>
          <p
            className={
              featured
                ? "mt-4 line-clamp-3 text-[length:var(--text-base)] font-semibold leading-7 text-white/72"
                : "mt-3 line-clamp-3 text-[length:var(--text-xs)] font-semibold leading-5 text-white/72"
            }
          >
            {post.excerpt}
          </p>
          <p className="mt-auto border-t border-white/12 pt-3 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-white/62">
            By PlasterPro Solution · {formatPublishedAge(post.publishedAt)}
          </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
