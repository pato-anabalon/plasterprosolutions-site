import { siteConfig } from "@/data/site";
import { fetchLatestNoCowboysReviews } from "@/lib/nocowboys-reviews";

export async function GET() {
  try {
    const reviews = await fetchLatestNoCowboysReviews();

    if (reviews.length) {
      return Response.json({
        reviews,
        source: "nocowboys",
        updatedAt: new Date().toISOString(),
      });
    }
  } catch {
    // Keep the public page stable if NoCowboys is temporarily unavailable.
  }

  return Response.json({
    reviews: siteConfig.customerReviews,
    source: "fallback",
    updatedAt: new Date().toISOString(),
  });
}
