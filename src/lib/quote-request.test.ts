import { parseLeadsApiUrl, parseSubmissionId } from "./quote-request";

describe("parseLeadsApiUrl", () => {
  it("should accept an https URL", () => {
    expect(parseLeadsApiUrl("https://crm.example.test/api/v1/leads", false)).toBe(
      "https://crm.example.test/api/v1/leads",
    );
  });

  it("should accept http only when allowed", () => {
    const localUrl = "http://192.168.1.33.nip.io:3100/api/v1/leads";

    expect(parseLeadsApiUrl(localUrl, true)).toBe(localUrl);
    expect(parseLeadsApiUrl(localUrl, false)).toBeNull();
  });

  it.each([undefined, "", "not a url", "ftp://crm.example.test/leads"])(
    "should return null for %p",
    (value) => {
      expect(parseLeadsApiUrl(value, true)).toBeNull();
    },
  );
});

describe("parseSubmissionId", () => {
  it("should keep a UUID", () => {
    expect(parseSubmissionId("4f1c2b9e-1111-4a2b-9c3d-000000000001")).toBe(
      "4f1c2b9e-1111-4a2b-9c3d-000000000001",
    );
  });

  it.each([undefined, 42, "short", "has spaces in it", "x".repeat(65)])(
    "should drop %p",
    (value) => {
      expect(parseSubmissionId(value)).toBe("");
    },
  );
});
