import { termsOfService } from "@/data/terms";

describe("termsOfService", () => {
  it("should expose the legal document metadata and sections", () => {
    expect(termsOfService.title).toBe("Terms of service");
    expect(termsOfService.description).toMatch(/goods and services/i);
    expect(termsOfService.sections.length).toBeGreaterThan(0);
  });

  it("should keep each legal section addressable with unchanged content", () => {
    expect(termsOfService.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "plastering-services",
          title: "Plastering services",
          content: expect.stringContaining("Terms and Conditions"),
        }),
      ]),
    );
  });
});
