/** @jest-environment node */

import { createJsonRequest, validQuotePayload } from "@/test/quote-fixtures";

async function loadPost() {
  jest.resetModules();
  const route = await import("./route");

  return route.POST;
}

async function readJson(response: Response) {
  return response.json() as Promise<{ error?: string; ok?: boolean }>;
}

describe("/api/quote/zapier", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.ZAPIER_QUOTE_WEBHOOK_URL = "https://hooks.zapier.com/test";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    } as Response);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("should return 200 for a valid quote and forward the sanitized payload", async () => {
    const POST = await loadPost();
    const response = await POST(
      createJsonRequest({
        ...validQuotePayload,
        firstName: "  Patricio\u0000  ",
      }),
    );

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(
      "https://hooks.zapier.com/test",
      expect.objectContaining({
        body: expect.any(String),
        method: "POST",
      }),
    );

    const [, init] = jest.mocked(global.fetch).mock.calls[0];
    const payload = JSON.parse(String(init?.body));

    expect(payload).toEqual(
      expect.objectContaining({
        email: validQuotePayload.email,
        fileUrls: "",
        firstName: "Patricio",
        submittedAt: expect.any(String),
      }),
    );
  });

  it("should return 200 without forwarding when the honeypot is filled", async () => {
    const POST = await loadPost();
    const response = await POST(
      createJsonRequest({
        ...validQuotePayload,
        website: "spam",
      }),
    );

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ ok: true });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should return 503 when the Zapier webhook URL is not configured", async () => {
    delete process.env.ZAPIER_QUOTE_WEBHOOK_URL;
    const POST = await loadPost();
    const response = await POST(createJsonRequest(validQuotePayload));

    expect(response.status).toBe(503);
    expect(await readJson(response)).toEqual({
      error: "The quote request service is not configured yet.",
    });
  });

  it("should return 502 when the webhook request fails", async () => {
    jest.mocked(global.fetch).mockRejectedValue(new Error("Network error"));
    const POST = await loadPost();
    const response = await POST(createJsonRequest(validQuotePayload));

    expect(response.status).toBe(502);
    expect(await readJson(response)).toEqual({
      error: "The quote request could not be sent. Please try again.",
    });
  });

  it("should return 429 after too many quote requests from one client", async () => {
    const POST = await loadPost();
    let response = new Response();

    for (let index = 0; index < 6; index += 1) {
      response = await POST(
        createJsonRequest(validQuotePayload, {
          "x-forwarded-for": "203.0.113.20",
        }),
      );
    }

    expect(response.status).toBe(429);
    expect(await readJson(response)).toEqual({
      error: "Too many quote requests. Please try again later.",
    });
  });
});
