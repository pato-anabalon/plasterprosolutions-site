/** @jest-environment node */

import { createJsonRequest, validQuotePayload } from "@/test/quote-fixtures";

const leadsApiUrl = "https://crm.example.test/api/v1/leads";
const blobFileUrl =
  "https://store.public.blob.vercel-storage.com/quote-requests/2026-05-13/patricio-anabalon-address/file-1.jpg";

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
    process.env = {
      ...originalEnv,
      NODO_CRM_API_KEY: "nodo_sk_test",
      NODO_CRM_LEADS_URL: leadsApiUrl,
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    } as Response);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("should forward a valid quote to the nodo CRM leads API", async () => {
    const POST = await loadPost();
    const response = await POST(
      createJsonRequest(
        {
          ...validQuotePayload,
          files: [
            {
              name: "file-1.jpg",
              size: 100,
              type: "image/jpeg",
              url: blobFileUrl,
            },
          ],
          firstName: "  Patricio\u0000  ",
          submissionId: "4f1c2b9e-1111-4a2b-9c3d-000000000001",
          uploadFolder: "quote-requests/2026-05-13/patricio-anabalon-address",
        },
        { "x-forwarded-for": "203.0.113.20" },
      ),
    );

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(
      leadsApiUrl,
      expect.objectContaining({ method: "POST" }),
    );

    const [, init] = jest.mocked(global.fetch).mock.calls[0];

    expect(init?.headers).toEqual({
      Authorization: "Bearer nodo_sk_test",
      "Content-Type": "application/json",
      "Idempotency-Key": "4f1c2b9e-1111-4a2b-9c3d-000000000001",
      "X-Client-Ip": "203.0.113.20",
    });
    expect(JSON.parse(String(init?.body))).toEqual({
      address: validQuotePayload.address,
      company: validQuotePayload.company,
      email: validQuotePayload.email,
      files: [
        {
          name: "file-1.jpg",
          size: 100,
          type: "image/jpeg",
          url: blobFileUrl,
        },
      ],
      firstName: "Patricio",
      lastName: validQuotePayload.lastName,
      message: validQuotePayload.message,
      page: "https://www.plasterprosolution.co.nz/contact",
      phone: validQuotePayload.phone,
      source: "Website",
      subject: validQuotePayload.subject,
    });
  });

  it("should leave out the idempotency and client IP headers it cannot trust", async () => {
    const POST = await loadPost();
    await POST(
      createJsonRequest({
        ...validQuotePayload,
        submissionId: "not a valid id!",
      }),
    );

    const [, init] = jest.mocked(global.fetch).mock.calls[0];

    expect(init?.headers).toEqual({
      Authorization: "Bearer nodo_sk_test",
      "Content-Type": "application/json",
    });
  });

  it("should return 503 when the CRM is not configured", async () => {
    delete process.env.NODO_CRM_API_KEY;
    const POST = await loadPost();
    const response = await POST(createJsonRequest(validQuotePayload));

    expect(response.status).toBe(503);
    expect(await readJson(response)).toEqual({
      error: "The quote request service is not configured yet.",
    });
    expect(global.fetch).not.toHaveBeenCalled();
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

  it("should return 502 when the CRM request fails", async () => {
    jest.mocked(global.fetch).mockRejectedValue(new Error("Network error"));
    const POST = await loadPost();
    const response = await POST(createJsonRequest(validQuotePayload));

    expect(response.status).toBe(502);
    expect(await readJson(response)).toEqual({
      error: "The quote request could not be sent. Please try again.",
    });
  });

  it("should return 502 when the CRM rejects the lead", async () => {
    jest.mocked(global.fetch).mockResolvedValue({ ok: false } as Response);
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
