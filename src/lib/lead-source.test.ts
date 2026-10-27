import { defaultLeadSource, leadSourceOptions, resolveLeadSource } from "./lead-source";

describe("resolveLeadSource", () => {
  it.each(leadSourceOptions.map((option) => option.value))(
    "should keep the offered value %p",
    (value) => {
      expect(resolveLeadSource(value)).toBe(value);
    },
  );

  it("should not accept the label of an option whose value differs", () => {
    expect(resolveLeadSource("Other Social Network")).toBe(defaultLeadSource);
  });

  it.each(["", "gogle", "google campaign", "  Flyer ", "<script>alert(1)</script>"])(
    "should fall back to the website for %p",
    (value) => {
      expect(resolveLeadSource(value)).toBe(defaultLeadSource);
    },
  );
});
