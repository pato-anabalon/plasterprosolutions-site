"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

type ProjectPostViewTrackerProps = {
  slug: string;
  title: string;
};

export function ProjectPostViewTracker({
  slug,
  title,
}: ProjectPostViewTrackerProps) {
  useEffect(() => {
    track("Project Post Viewed", {
      slug,
      title,
    });
  }, [slug, title]);

  return null;
}
