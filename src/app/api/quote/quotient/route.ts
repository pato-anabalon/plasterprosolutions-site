import {
  type QuotePayload,
  type QuoteRequestBody,
  asCleanString,
  createInMemoryRateLimiter,
  getClientKey,
  quoteWebhookTimeoutMs,
  rateLimitMaxRequests,
  rateLimitWindowMs,
  readQuoteRequest,
  validateQuotePayload,
} from "@/lib/quote-request";

const quotientLeadFormPostUrl =
  "https://www.quotientapp.com/e/17251-dc26ea1bb5ec4fe6b9bb86531d1d0cdb/form/post?embed";

const isRateLimited = createInMemoryRateLimiter(
  rateLimitWindowMs,
  rateLimitMaxRequests,
);

function buildQuotientMessage(payload: QuotePayload) {
  const details = [
    `Message: ${payload.message}`,
    `Address: ${payload.address}`,
    payload.fileUrls ? `Files:\n${payload.fileUrls}` : "",
    payload.uploadFolder ? `Upload folder: ${payload.uploadFolder}` : "",
    `Source: ${payload.source}`,
    `Page: ${payload.page}`,
    `Submitted at: ${payload.submittedAt}`,
  ].filter(Boolean);

  return details.join("\n\n");
}

function createQuotientFormBody(payload: QuotePayload) {
  const formBody = new URLSearchParams();

  formBody.set("leadR[_s][lead_subject]", payload.subject);
  formBody.set("leadR[_s][lead_message]", buildQuotientMessage(payload));
  formBody.set("leadR[_s][lead_name_first]", payload.firstName);
  formBody.set("leadR[_s][lead_name_last]", payload.lastName);
  formBody.set("leadR[_s][lead_email]", payload.email);
  formBody.set("leadR[_s][lead_company]", payload.company);
  formBody.set("leadR[_s][lead_phone]", payload.phone);
  formBody.set("attach_key", "");
  formBody.set("attach_name", "");

  return formBody;
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

  let response: Response;

  try {
    response = await fetch(quotientLeadFormPostUrl, {
      body: createQuotientFormBody(result.payload),
      cache: "no-store",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
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
