type QuoteRequestBody = {
  address?: string;
  company?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  message?: string;
  page?: string;
  phone?: string;
  source?: string;
  subject?: string;
  website?: string;
};

type QuotePayload = {
  address: string;
  company: string;
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  page: string;
  phone: string;
  source: string;
  subject: string;
  submittedAt: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const requiredFields: Array<keyof QuotePayload> = [
  "subject",
  "message",
  "firstName",
  "lastName",
  "email",
  "address",
  "phone",
];

const fieldLimits = {
  address: 240,
  company: 120,
  email: 160,
  firstName: 80,
  lastName: 80,
  message: 3000,
  page: 120,
  phone: 40,
  source: 80,
  subject: 140,
} satisfies Record<keyof Omit<QuotePayload, "submittedAt">, number>;

const maxBodySize = 16 * 1024;
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMaxRequests = 5;
const webhookTimeoutMs = 10_000;
const rateLimitStore = new Map<string, RateLimitEntry>();

function asCleanString(value: unknown) {
  return typeof value === "string" ? value.replace(/\0/g, "").trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^[0-9+()\s-]{7,40}$/.test(value);
}

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
  const current = rateLimitStore.get(clientKey);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(clientKey, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    });
    return false;
  }

  current.count += 1;

  return current.count > rateLimitMaxRequests;
}

function isOversized(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  return contentLength > maxBodySize;
}

function parseWebhookUrl(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function isTooLong(payload: QuotePayload) {
  return Object.entries(fieldLimits).some(([field, limit]) => {
    const value = payload[field as keyof typeof fieldLimits];
    return value.length > limit;
  });
}

export async function POST(request: Request) {
  let body: QuoteRequestBody;

  if (isOversized(request)) {
    return Response.json(
      { error: "The quote request is too large." },
      { status: 413 },
    );
  }

  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return Response.json(
      { error: "Too many quote requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const text = await request.text();

    if (text.length > maxBodySize) {
      return Response.json(
        { error: "The quote request is too large." },
        { status: 413 },
      );
    }

    body = JSON.parse(text) as QuoteRequestBody;
  } catch {
    return Response.json(
      { error: "The quote request could not be read." },
      { status: 400 },
    );
  }

  if (asCleanString(body.website)) {
    return Response.json({ ok: true });
  }

  const payload: QuotePayload = {
    address: asCleanString(body.address),
    company: asCleanString(body.company),
    email: asCleanString(body.email),
    firstName: asCleanString(body.firstName),
    lastName: asCleanString(body.lastName),
    message: asCleanString(body.message),
    page: asCleanString(body.page) || "/contact",
    phone: asCleanString(body.phone),
    source: asCleanString(body.source) || "Website",
    subject: asCleanString(body.subject),
    submittedAt: new Date().toISOString(),
  };

  const missingField = requiredFields.find((field) => !payload[field]);

  if (missingField) {
    return Response.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  if (isTooLong(payload)) {
    return Response.json(
      { error: "Please shorten the quote request details." },
      { status: 400 },
    );
  }

  if (!isValidEmail(payload.email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!isValidPhone(payload.phone)) {
    return Response.json(
      { error: "Please enter a valid phone number." },
      { status: 400 },
    );
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
      body: JSON.stringify(payload),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(webhookTimeoutMs),
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
