"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { track } from "@vercel/analytics";
import type { ProjectPost } from "@/lib/project-posts";

type ProjectPostCardProps = {
  featured?: boolean;
  post: ProjectPost;
};

export function ProjectPostCard({ featured = false, post }: ProjectPostCardProps) {
  return (
    <article
      className={
        featured
          ? "group overflow-hidden rounded-lg bg-charcoal text-white sm:col-span-2"
          : "surface-panel group overflow-hidden rounded-lg"
      }
    >
      <Link
        aria-label={`Read project story: ${post.title}`}
        className="focus-ring block h-full"
        href={`/projects/${post.slug}`}
        onClick={() => {
          track("Project Card Clicked", {
            slug: post.slug,
            title: post.title,
          });
        }}
      >
        <div className="relative overflow-hidden">
          <Image
            alt={post.title}
            className={`w-full object-cover transition duration-700 ease-out group-hover:scale-105 group-focus-visible:scale-105 ${
              featured ? "aspect-[16/9] opacity-90" : "aspect-[4/3]"
            }`}
            height={featured ? 640 : 540}
            sizes={featured ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
            src={post.heroImage}
            width={featured ? 1080 : 720}
          />
          <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/20 bg-charcoal/70 text-white backdrop-blur transition duration-300 group-hover:border-spicy-orange group-hover:bg-spicy-orange">
            <ArrowUpRight size={20} aria-hidden="true" />
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {[post.service, post.location].map((item) => (
              <span
                className={
                  featured
                    ? "rounded-full border border-white/14 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/70"
                    : "rounded-full border border-border px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.14em] text-muted"
                }
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
          <h2
            className={
              featured
                ? "mt-5 text-3xl font-black leading-tight text-white sm:text-5xl"
                : "mt-5 text-2xl font-black leading-tight text-foreground"
            }
          >
            {post.title}
          </h2>
          <p
            className={
              featured
                ? "mt-4 max-w-2xl text-base leading-7 text-white/66"
                : "mt-4 text-base leading-7 text-muted"
            }
          >
            {post.excerpt}
          </p>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-spicy-orange">
            Read project
          </p>
        </div>
      </Link>
    </article>
  );
}
