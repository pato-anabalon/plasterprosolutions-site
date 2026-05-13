import { ThemeToggle } from "./theme-toggle";
import { render, screen, setupUser } from "@/test/test-utils";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "";
    document.documentElement.style.colorScheme = "";
    window.localStorage.clear();
  });

  it("should render light mode as the initial state", () => {
    render(<ThemeToggle />);

    expect(screen.getByRole("button", { name: /switch to dark mode/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("should switch to dark mode and persist the preference", async () => {
    const user = setupUser();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: /switch to dark mode/i }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(window.localStorage.getItem("plasterpro-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: /switch to light mode/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("should render dark mode as the initial state when the document theme is dark", () => {
    document.documentElement.dataset.theme = "dark";

    render(<ThemeToggle />);

    expect(screen.getByRole("button", { name: /switch to light mode/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
