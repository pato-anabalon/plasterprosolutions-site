import {
  type QuoteFileAttachment,
  isSafeQuoteBlobUrl,
  sanitizeQuoteFileName,
  validateQuoteFiles,
} from "@/lib/quote-files";

export type QuoteRequestBody = {
  address?: string;
  company?: string;
  email?: string;
  files?: unknown;
  firstName?: string;
  lastName?: string;
  message?: string;
  page?: string;
  phone?: string;
  source?: string;
  subject?: string;
  uploadFolder?: string;
  website?: string;
};

export type QuoteTextPayload = {
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
};

export type QuotePayload = QuoteTextPayload & {
  files: QuoteFileAttachment[];
  fileUrls: string;
  submittedAt: string;
  uploadFolder: string;
};

export type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export type QuoteValidationResult =
  | {
      ok: true;
      payload: QuotePayload;
    }
  | {
      error: string;
      ok: false;
      status: number;
    };

export const maxJsonBodySize = 32 * 1024;
export const quoteWebhookTimeoutMs = 10_000;
export const rateLimitWindowMs = 10 * 60 * 1000;
export const rateLimitMaxRequests = 5;

const requiredFields: Array<keyof QuoteTextPayload> = [
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
} satisfies Record<keyof QuoteTextPayload, number>;

export function asCleanString(value: unknown) {
  return typeof value === "string" ? value.replace(/\0/g, "").trim() : "";
}

export function createInMemoryRateLimiter(windowMs: number, maxRequests: number) {
  const store = new Map<string, RateLimitEntry>();

  return function isRateLimited(clientKey: string) {
    const now = Date.now();
    const current = store.get(clientKey);

    if (!current || current.resetAt <= now) {
      store.set(clientKey, {
        count: 1,
        resetAt: now + windowMs,
      });
      return false;
    }

    current.count += 1;

    return current.count > maxRequests;
  };
}

export function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();

  return (
    forwardedIp ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function parseWebhookUrl(value: string | undefined) {
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

export async function readQuoteRequest(request: Request) {
  const text = await request.text();

  if (text.length > maxJsonBodySize) {
    throw new Error("oversized-json");
  }

  return JSON.parse(text) as QuoteRequestBody;
}

export function validateQuotePayload(body: QuoteRequestBody): QuoteValidationResult {
  const { files, error: fileError } = parseFileAttachments(body.files);

  if (fileError) {
    return {
      error: fileError,
      ok: false,
      status: 400,
    };
  }

  const { uploadFolder, error: uploadFolderError } = parseUploadFolder(
    body.uploadFolder,
    files,
  );

  if (uploadFolderError) {
    return {
      error: uploadFolderError,
      ok: false,
      status: 400,
    };
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
    files,
    fileUrls: files.map((file) => `${file.name}: ${file.url}`).join("\n"),
    submittedAt: new Date().toISOString(),
    uploadFolder,
  };

  const missingField = requiredFields.find((field) => !payload[field]);

  if (missingField) {
    return {
      error: "Please complete all required fields.",
      ok: false,
      status: 400,
    };
  }

  if (isTooLong(payload)) {
    return {
      error: "Please shorten the quote request details.",
      ok: false,
      status: 400,
    };
  }

  if (!isValidEmail(payload.email)) {
    return {
      error: "Please enter a valid email address.",
      ok: false,
      status: 400,
    };
  }

  if (!isValidPhone(payload.phone)) {
    return {
      error: "Please enter a valid phone number.",
      ok: false,
      status: 400,
    };
  }

  return {
    ok: true,
    payload,
  };
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^[0-9+()\s-]{7,40}$/.test(value);
}

function isTooLong(payload: QuotePayload) {
  return Object.entries(fieldLimits).some(([field, limit]) => {
    const value = payload[field as keyof typeof fieldLimits];
    return value.length > limit;
  });
}

function parseFileAttachments(value: unknown) {
  if (!Array.isArray(value)) {
    return {
      files: [],
      error: null,
    };
  }

  const files = value.map((item) => {
    const record = item && typeof item === "object" ? item : {};

    return {
      name: sanitizeQuoteFileName("name" in record ? record.name : ""),
      size:
        "size" in record && typeof record.size === "number" ? record.size : 0,
      type: asCleanString("type" in record ? record.type : ""),
      url: asCleanString("url" in record ? record.url : ""),
    };
  });

  const unsafeUrl = files.find((file) => !isSafeQuoteBlobUrl(file.url));

  if (unsafeUrl) {
    return {
      files: [],
      error: "The uploaded file links could not be verified.",
    };
  }

  const validationError = validateQuoteFiles(files);

  return {
    files,
    error: validationError,
  };
}

function parseUploadFolder(value: unknown, files: QuoteFileAttachment[]) {
  const uploadFolder = asCleanString(value);

  if (!uploadFolder) {
    return {
      error: null,
      uploadFolder: "",
    };
  }

  const safeFolderPattern =
    /^quote-requests\/\d{4}-\d{2}-\d{2}\/[a-z0-9-]{3,180}$/;

  if (!safeFolderPattern.test(uploadFolder)) {
    return {
      error: "The uploaded file folder could not be verified.",
      uploadFolder: "",
    };
  }

  const folderMismatch = files.find((file) => {
    try {
      const url = new URL(file.url);
      return !decodeURIComponent(url.pathname).includes(`/${uploadFolder}/`);
    } catch {
      return true;
    }
  });

  if (folderMismatch) {
    return {
      error: "The uploaded files do not match the quote folder.",
      uploadFolder: "",
    };
  }

  return {
    error: null,
    uploadFolder,
  };
}
