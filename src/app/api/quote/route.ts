import { siteConfig } from "@/data/site";
import {
  type QuotePayload,
  type QuoteRequestBody,
  asCleanString,
  createInMemoryRateLimiter,
  getClientKey,
  parseLeadsApiUrl,
  parseSubmissionId,
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

function createLeadBody(payload: QuotePayload) {
  return {
    address: payload.address,
    company: payload.company,
    email: payload.email,
    files: payload.files,
    firstName: payload.firstName,
    lastName: payload.lastName,
    message: payload.message,
    page: new URL(payload.page, siteConfig.url).toString(),
    phone: payload.phone,
    source: payload.source,
    subject: payload.subject,
  };
}

function createLeadHeaders(apiKey: string, clientKey: string, submissionId: string) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  // The CRM sees this server's IP, so it is told the visitor's instead.
  if (clientKey !== "unknown") {
    headers["X-Client-Ip"] = clientKey;
  }

  if (submissionId) {
    headers["Idempotency-Key"] = submissionId;
  }

  return headers;
}

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

  const leadsApiUrl = parseLeadsApiUrl(process.env.NODO_CRM_LEADS_URL);
  const apiKey = asCleanString(process.env.NODO_CRM_API_KEY);

  if (!leadsApiUrl || !apiKey) {
    return Response.json(
      { error: "The quote request service is not configured yet." },
      { status: 503 },
    );
  }

  let response: Response;

  try {
    response = await fetch(leadsApiUrl, {
      body: JSON.stringify(createLeadBody(result.payload)),
      cache: "no-store",
      headers: createLeadHeaders(apiKey, clientKey, parseSubmissionId(body.submissionId)),
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
