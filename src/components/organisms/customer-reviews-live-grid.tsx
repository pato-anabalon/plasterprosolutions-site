"use client";

import { useEffect, useState } from "react";
import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { ReviewCard } from "@/components/molecules/review-card";
import type { CustomerReview } from "@/lib/nocowboys-reviews";

type CustomerReviewsLiveGridProps = {
  initialReviews: CustomerReview[];
  tone: "dark" | "light";
};

type CustomerReviewsResponse = {
  reviews?: CustomerReview[];
};

const customerReviewsRefreshIntervalMs = 10 * 60 * 1000;

export function CustomerReviewsLiveGrid({
  initialReviews,
  tone,
}: CustomerReviewsLiveGridProps) {
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    if (typeof fetch !== "function") {
      return;
    }

    let ignore = false;
    let abortController = new AbortController();

    async function refreshReviews() {
      abortController.abort();
      abortController = new AbortController();

      try {
        const response = await fetch("/api/customer-reviews", {
          cache: "no-store",
          signal: abortController.signal,
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as CustomerReviewsResponse;

        if (!ignore && Array.isArray(payload.reviews) && payload.reviews.length) {
          setReviews(payload.reviews.slice(0, 3));
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    void refreshReviews();

    const intervalId = window.setInterval(
      refreshReviews,
      customerReviewsRefreshIntervalMs,
    );

    return () => {
      ignore = true;
      abortController.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="mt-12 grid auto-rows-fr items-stretch gap-5 md:grid-cols-3" data-testid="customer-reviews-grid">
      {reviews.map((review, index) => (
        <AnimatedReveal
          className="h-full"
          data-testid="customer-reviews-item"
          key={`${review.name}-${review.date}-${review.title}`}
          delay={index * 0.05}
        >
          <ReviewCard {...review} tone={tone} />
        </AnimatedReveal>
      ))}
    </div>
  );
}
