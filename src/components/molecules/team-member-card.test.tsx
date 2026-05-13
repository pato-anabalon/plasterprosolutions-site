import { TeamMemberCard } from "./team-member-card";
import { teamMembers } from "@/data/team";
import { render, screen, setupUser } from "@/test/test-utils";

describe("TeamMemberCard", () => {
  it("should render the team member summary", () => {
    render(<TeamMemberCard index={0} member={teamMembers[0]} />);

    expect(
      screen.getByRole("img", {
        name: /rolando reveco, managing director at plasterpro solution/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Rolando Reveco")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Managing Director")[0]).toBeInTheDocument();
  });

  it("should toggle the expanded profile", async () => {
    const user = setupUser();
    render(<TeamMemberCard index={0} member={teamMembers[0]} />);

    const openButton = screen.getByRole("button", {
      name: /open rolando reveco profile/i,
    });

    await user.click(openButton);

    expect(
      screen.getByRole("button", { name: /close rolando reveco profile/i }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/originally from chile/i)).toBeInTheDocument();
  });
});
