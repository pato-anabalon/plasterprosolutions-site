import { parseNoCowboysReviews } from "./nocowboys-reviews";

describe("NoCowboys reviews", () => {
  it("should return the latest three 100 percent reviews", () => {
    const reviews = parseNoCowboysReviews({
      data: [
        {
          username: "Judy",
          description:
            "I had a great experience with the team at PlasterPro.</p><p>Rolando came out the same day.<br />Clean finish and tidy handover.",
          rating: "100",
          date: "31st May, 2026",
        },
        {
          username: "Jane",
          description: "Great work, but not a perfect score.",
          rating: "98",
          date: "28th May, 2026",
        },
        {
          username: "Geoff &amp; Prue",
          description: "What a great Team!<br />A pleasure to deal with Rolando and his Team!",
          rating: "100",
          date: "25th March, 2026",
        },
        {
          username: "Nicholas",
          description: "Great service provided by Rolando and his team.",
          rating: "100",
          date: "31st January, 2026",
        },
        {
          username: "Jav",
          description: "Excellent experience from start to finish.",
          rating: "100",
          date: "29th January, 2026",
        },
      ],
    });

    expect(reviews).toEqual([
      expect.objectContaining({
        body: "Rolando came out the same day.\nClean finish and tidy handover.",
        date: "31st May, 2026",
        name: "Judy",
        rating: "100%",
        title: "I had a great experience with the team at PlasterPro.",
      }),
      expect.objectContaining({
        body: "A pleasure to deal with Rolando and his Team!",
        name: "Geoff & Prue",
        title: "What a great Team!",
      }),
      expect.objectContaining({
        name: "Nicholas",
        title: "Great service provided by Rolando and his team.",
      }),
    ]);
  });
});
