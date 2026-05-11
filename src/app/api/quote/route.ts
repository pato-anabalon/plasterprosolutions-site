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

const requiredFields: Array<keyof QuotePayload> = [
  "subject",
  "message",
  "firstName",
  "lastName",
  "email",
  "address",
  "phone",
];

function asCleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: QuoteRequestBody;

  try {
    body = (await request.json()) as QuoteRequestBody;
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

  if (!isValidEmail(payload.email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const webhookUrl = process.env.ZAPIER_QUOTE_WEBHOOK_URL;

  if (!webhookUrl) {
    return Response.json(
      { error: "The quote request service is not configured yet." },
      { status: 503 },
    );
  }

  const response = await fetch(webhookUrl, {
    body: JSON.stringify(payload),
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    return Response.json(
      { error: "The quote request could not be sent. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
