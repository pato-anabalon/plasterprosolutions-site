/** @jest-environment node */

import { siteConfig } from "@/data/site";
import { fetchLatestNoCowboysReviews } from "@/lib/nocowboys-reviews";

jest.mock("@/lib/nocowboys-reviews", () => ({
  fetchLatestNoCowboysReviews: jest.fn(),
}));

async function loadRoute() {
  return import("./route");
}

describe("/api/customer-reviews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return latest NoCowboys reviews", async () => {
    jest.mocked(fetchLatestNoCowboysReviews).mockResolvedValue([
      {
        body: "Clear communication and tidy work.",
        date: "31st May, 2026",
        name: "Judy",
        rating: "100%",
        title: "Great experience",
      },
    ]);

    const { GET } = await loadRoute();
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      reviews: [
        {
          body: "Clear communication and tidy work.",
          date: "31st May, 2026",
          name: "Judy",
          rating: "100%",
          title: "Great experience",
        },
      ],
      source: "nocowboys",
      updatedAt: expect.any(String),
    });
  });

  it("should return fallback reviews when NoCowboys fails", async () => {
    jest.mocked(fetchLatestNoCowboysReviews).mockRejectedValue(new Error("Network error"));

    const { GET } = await loadRoute();
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      reviews: siteConfig.customerReviews,
      source: "fallback",
      updatedAt: expect.any(String),
    });
  });
});
