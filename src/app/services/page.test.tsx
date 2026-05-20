import ServicesPage from "./page";
import { siteConfig } from "@/data/site";
import { render, screen } from "@/test/test-utils";

describe("ServicesPage", () => {
  it("should render a Services Include heading for each service card", () => {
    render(<ServicesPage />);

    expect(screen.getAllByRole("heading", { name: /services include/i })).toHaveLength(
      siteConfig.services.length,
    );
  });
});
