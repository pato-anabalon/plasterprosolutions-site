/** @jest-environment node */

import { handleUpload } from "@vercel/blob/client";
import { POST } from "./route";

const mockedHandleUpload = jest.mocked(handleUpload);

function createUploadRequest(body: unknown, headers?: HeadersInit) {
  return new Request("https://www.plasterprosolution.co.nz/api/quote/upload", {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    method: "POST",
  });
}

async function readJson(response: Response) {
  return response.json() as Promise<{
    clientToken?: string;
    error?: string;
    response?: string;
    type?: string;
  }>;
}

describe("/api/quote/upload", () => {
  const originalEnv = process.env;
  const validPath =
    "quote-requests/2026-05-13/patricio-anabalon-address-a1b2c3d4/file-1.jpg";

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      BLOB_READ_WRITE_TOKEN: "blob-token",
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return 503 when Blob storage is not configured", async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;

    const response = await POST(createUploadRequest({}));

    expect(response.status).toBe(503);
    expect(await readJson(response)).toEqual({
      error: "File uploads are not configured yet.",
    });
  });

  it("should return 400 when the request body cannot be read", async () => {
    const response = await POST(
      new Request("https://www.plasterprosolution.co.nz/api/quote/upload", {
        body: "{bad-json",
        method: "POST",
      }),
    );

    expect(response.status).toBe(400);
    expect(await readJson(response)).toEqual({
      error: "The upload request could not be read.",
    });
  });

  it("should generate a client token for a valid quote upload path", async () => {
    mockedHandleUpload.mockImplementation(async ({ onBeforeGenerateToken }) => {
      const tokenOptions = await onBeforeGenerateToken(validPath, null, false);

      expect(tokenOptions).toEqual(
        expect.objectContaining({
          addRandomSuffix: false,
          maximumSizeInBytes: 10 * 1024 * 1024,
        }),
      );

      return {
        clientToken: "client-token",
        type: "blob.generate-client-token",
      };
    });

    const response = await POST(
      createUploadRequest({
        payload: {
          multipart: false,
          pathname: validPath,
        },
        type: "blob.generate-client-token",
      }),
    );

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({
      clientToken: "client-token",
      type: "blob.generate-client-token",
    });
  });

  it("should return 400 when Blob rejects the upload request", async () => {
    mockedHandleUpload.mockImplementation(async ({ onBeforeGenerateToken }) => {
      await onBeforeGenerateToken("invalid/file-1.jpg", null, false);

      return {
        clientToken: "client-token",
        type: "blob.generate-client-token",
      };
    });

    const response = await POST(createUploadRequest({}));

    expect(response.status).toBe(400);
    expect(await readJson(response)).toEqual({
      error: "The upload could not be authorised.",
    });
  });

  it("should return 429 after too many upload attempts from one client", async () => {
    mockedHandleUpload.mockResolvedValue({
      clientToken: "client-token",
      type: "blob.generate-client-token",
    });
    let response = new Response();

    for (let index = 0; index < 21; index += 1) {
      response = await POST(
        createUploadRequest(
          {},
          {
            "x-forwarded-for": "203.0.113.20",
          },
        ),
      );
    }

    expect(response.status).toBe(429);
    expect(await readJson(response)).toEqual({
      error: "Too many upload attempts. Please try again later.",
    });
  });
});
