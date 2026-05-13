import { HomeServiceCards } from "./home-service-cards";
import { siteConfig } from "@/data/site";
import { render, screen, setupUser } from "@/test/test-utils";

describe("HomeServiceCards", () => {
  it("should render service links for each service", () => {
    render(<HomeServiceCards services={siteConfig.services} />);

    siteConfig.services.forEach((service) => {
      expect(
        screen.getAllByRole("link", { name: new RegExp(service.title, "i") })[0],
      ).toHaveAttribute("href", `/services#${service.slug}`);
    });
  });

  it("should expand a selected mobile service card", async () => {
    const user = setupUser();
    render(<HomeServiceCards services={siteConfig.services} />);

    const commercialButton = screen.getByRole("button", {
      name: /commercial plastering/i,
    });
    const residentialButton = screen.getByRole("button", {
      name: /residential plastering/i,
    });

    expect(commercialButton).toHaveAttribute("aria-expanded", "true");

    await user.click(residentialButton);

    expect(residentialButton).toHaveAttribute("aria-expanded", "true");
    expect(commercialButton).toHaveAttribute("aria-expanded", "false");
  });
});
