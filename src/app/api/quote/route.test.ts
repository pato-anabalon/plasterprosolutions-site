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

describe("/api/quote", () => {
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

  it("should return 400 when required fields are missing", async () => {
    const POST = await loadPost();
    const response = await POST(
      createJsonRequest({
        ...validQuotePayload,
        subject: "",
      }),
    );

    expect(response.status).toBe(400);
    expect(await readJson(response)).toEqual({
      error: "Please complete all required fields.",
    });
  });

  it.each([
    ["invalid email", { email: "not-an-email" }, "Please enter a valid email address."],
    ["invalid phone", { phone: "abc" }, "Please enter a valid phone number."],
  ])("should return 400 for %s", async (_name, override, error) => {
    const POST = await loadPost();
    const response = await POST(
      createJsonRequest({
        ...validQuotePayload,
        ...override,
      }),
    );

    expect(response.status).toBe(400);
    expect(await readJson(response)).toEqual({ error });
  });

  it("should return 400 for unsafe uploaded file URLs", async () => {
    const POST = await loadPost();
    const response = await POST(
      createJsonRequest({
        ...validQuotePayload,
        files: [
          {
            name: "file-1.jpg",
            size: 100,
            type: "image/jpeg",
            url: "https://example.com/quote-requests/2026-05-13/folder/file-1.jpg",
          },
        ],
      }),
    );

    expect(response.status).toBe(400);
    expect(await readJson(response)).toEqual({
      error: "The uploaded file links could not be verified.",
    });
  });

  it("should return 400 when uploaded files do not match the upload folder", async () => {
    const POST = await loadPost();
    const response = await POST(
      createJsonRequest({
        ...validQuotePayload,
        files: [
          {
            name: "file-1.jpg",
            size: 100,
            type: "image/jpeg",
            url: "https://store.public.blob.vercel-storage.com/quote-requests/2026-05-13/other-folder/file-1.jpg",
          },
        ],
        uploadFolder: "quote-requests/2026-05-13/current-folder",
      }),
    );

    expect(response.status).toBe(400);
    expect(await readJson(response)).toEqual({
      error: "The uploaded files do not match the quote folder.",
    });
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

  it("should return 502 when the webhook returns a non-ok response", async () => {
    jest.mocked(global.fetch).mockResolvedValue({ ok: false } as Response);
    const POST = await loadPost();
    const response = await POST(createJsonRequest(validQuotePayload));

    expect(response.status).toBe(502);
    expect(await readJson(response)).toEqual({
      error: "The quote request could not be sent. Please try again.",
    });
  });

  it("should return 413 when the JSON body is too large", async () => {
    const POST = await loadPost();
    const response = await POST(
      createJsonRequest({
        ...validQuotePayload,
        message: "x".repeat(33 * 1024),
      }),
    );

    expect(response.status).toBe(413);
    expect(await readJson(response)).toEqual({
      error: "The quote request is too large.",
    });
  });

  it("should return 429 after too many quote requests from one client", async () => {
    const POST = await loadPost();
    let response = new Response();

    for (let index = 0; index < 6; index += 1) {
      response = await POST(
        createJsonRequest(validQuotePayload, {
          "x-forwarded-for": "203.0.113.10",
        }),
      );
    }

    expect(response.status).toBe(429);
    expect(await readJson(response)).toEqual({
      error: "Too many quote requests. Please try again later.",
    });
  });
});
