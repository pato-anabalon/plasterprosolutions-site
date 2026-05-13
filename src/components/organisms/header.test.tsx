import { usePathname } from "next/navigation";
import { Header } from "./header";
import { render, screen, setupUser, within } from "@/test/test-utils";

const mockedUsePathname = jest.mocked(usePathname);

describe("Header", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue("/");
    document.body.style.overflow = "";
  });

  it("should mark the current desktop navigation item", () => {
    mockedUsePathname.mockReturnValue("/projects");

    render(<Header />);

    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("should open and close the mobile menu from the hamburger button", async () => {
    const user = setupUser();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("navigation", { name: /mobile and tablet/i })).toBeVisible();

    await user.click(screen.getByRole("button", { name: /close menu/i }));

    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("should close the mobile menu when a mobile navigation link is clicked", async () => {
    const user = setupUser();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const mobileNav = screen.getByRole("navigation", {
      name: /mobile and tablet navigation/i,
    });

    await user.click(within(mobileNav).getByRole("link", { name: /contact/i }));

    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
