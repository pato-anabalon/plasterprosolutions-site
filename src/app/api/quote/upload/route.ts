import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import {
  allowedQuoteMimeTypes,
  isQuoteUploadPath,
  quoteFileConfig,
} from "@/lib/quote-files";

const uploadRateLimitWindowMs = 10 * 60 * 1000;
const uploadRateLimitMaxRequests = 20;
const uploadRateLimitStore = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();

  return (
    forwardedIp ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  const current = uploadRateLimitStore.get(clientKey);

  if (!current || current.resetAt <= now) {
    uploadRateLimitStore.set(clientKey, {
      count: 1,
      resetAt: now + uploadRateLimitWindowMs,
    });
    return false;
  }

  current.count += 1;

  return current.count > uploadRateLimitMaxRequests;
}

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: "File uploads are not configured yet." },
      { status: 503 },
    );
  }

  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return Response.json(
      { error: "Too many upload attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body: HandleUploadBody;

  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return Response.json(
      { error: "The upload request could not be read." },
      { status: 400 },
    );
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!isQuoteUploadPath(pathname)) {
          throw new Error("Invalid upload path.");
        }

        return {
          addRandomSuffix: false,
          allowedContentTypes: allowedQuoteMimeTypes,
          maximumSizeInBytes: quoteFileConfig.maxFileSize,
        };
      },
    });

    return Response.json(jsonResponse);
  } catch {
    return Response.json(
      { error: "The upload could not be authorised." },
      { status: 400 },
    );
  }
}
