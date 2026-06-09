import {
  type QuoteRequestBody,
  asCleanString,
  createInMemoryRateLimiter,
  getClientKey,
  parseWebhookUrl,
  quoteWebhookTimeoutMs,
  rateLimitMaxRequests,
  rateLimitWindowMs,
  readQuoteRequest,
  validateQuotePayload,
} from "@/lib/quote-request";

const isRateLimited = createInMemoryRateLimiter(
  rateLimitWindowMs,
  rateLimitMaxRequests,
);

export async function POST(request: Request) {
  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return Response.json(
      { error: "Too many quote requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: QuoteRequestBody;

  try {
    body = await readQuoteRequest(request);
  } catch (error) {
    if (error instanceof Error && error.message === "oversized-json") {
      return Response.json(
        { error: "The quote request is too large." },
        { status: 413 },
      );
    }
    return Response.json(
      { error: "The quote request could not be read." },
      { status: 400 },
    );
  }

  if (asCleanString(body.website)) {
    return Response.json({ ok: true });
  }

  const result = validateQuotePayload(body);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  const webhookUrl = parseWebhookUrl(process.env.ZAPIER_QUOTE_WEBHOOK_URL);

  if (!webhookUrl) {
    return Response.json(
      { error: "The quote request service is not configured yet." },
      { status: 503 },
    );
  }

  let response: Response;

  try {
    response = await fetch(webhookUrl, {
      body: JSON.stringify(result.payload),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(quoteWebhookTimeoutMs),
    });
  } catch {
    return Response.json(
      { error: "The quote request could not be sent. Please try again." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return Response.json(
      { error: "The quote request could not be sent. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
