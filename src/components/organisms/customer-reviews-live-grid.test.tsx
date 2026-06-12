import { CustomerReviewsLiveGrid } from "./customer-reviews-live-grid";
import { render, screen } from "@/test/test-utils";

const initialReviews = [
  {
    body: "Static review body.",
    date: "Jan 2026",
    name: "Nicholas",
    rating: "100%",
    title: "Static review",
  },
];

describe("CustomerReviewsLiveGrid", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        reviews: [
          {
            body: "Fresh review from NoCowboys.",
            date: "31st May, 2026",
            name: "Judy",
            rating: "100%",
            title: "Fresh NoCowboys review",
          },
        ],
      }),
      ok: true,
    } as Response);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render fallback reviews and refresh from the API", async () => {
    render(<CustomerReviewsLiveGrid initialReviews={initialReviews} tone="dark" />);

    expect(screen.getByRole("heading", { name: /static review/i })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: /fresh nocowboys review/i })).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/customer-reviews",
      expect.objectContaining({ cache: "no-store" }),
    );
  });
});
