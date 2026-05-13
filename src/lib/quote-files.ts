export type QuoteFileAttachment = {
  name: string;
  size: number;
  type: string;
  url: string;
};

export type QuoteUploadFolderInput = {
  address: string;
  firstName: string;
  lastName: string;
};

type QuoteFileLike = {
  name: string;
  size: number;
  type: string;
};

export const quoteFileConfig = {
  maxFiles: 5,
  maxFileSize: 10 * 1024 * 1024,
  maxTotalFileSize: 25 * 1024 * 1024,
};

export const allowedQuoteMimeTypes = [
  "application/pdf",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const acceptedQuoteFileTypes =
  ".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf";

const allowedFileTypes: Record<string, string[]> = {
  ".heic": ["image/heic", "image/heif"],
  ".heif": ["image/heic", "image/heif"],
  ".jpeg": ["image/jpeg"],
  ".jpg": ["image/jpeg"],
  ".pdf": ["application/pdf"],
  ".png": ["image/png"],
  ".webp": ["image/webp"],
};

export function sanitizeQuoteFileName(fileName: string) {
  const fallbackName = "attachment";
  const baseName = fileName.replace(/\0/g, "").split(/[\\/]/).pop();
  const safeName =
    baseName
      ?.replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^\.+/, "")
      .slice(0, 120) || fallbackName;

  return safeName || fallbackName;
}

export function getQuoteFileExtension(fileName: string) {
  const match = fileName.toLowerCase().match(/\.[a-z0-9]+$/);

  return match?.[0] ?? "";
}

export function isAllowedQuoteFileType(file: QuoteFileLike) {
  const allowedMimeTypes = allowedFileTypes[getQuoteFileExtension(file.name)];

  if (!allowedMimeTypes) {
    return false;
  }

  return !file.type || allowedMimeTypes.includes(file.type);
}

export function validateQuoteFiles(files: QuoteFileLike[]) {
  if (files.length > quoteFileConfig.maxFiles) {
    return `Please upload no more than ${quoteFileConfig.maxFiles} files.`;
  }

  const oversizedFile = files.find(
    (file) => file.size > quoteFileConfig.maxFileSize,
  );

  if (oversizedFile) {
    return "Each file must be 10 MB or smaller.";
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > quoteFileConfig.maxTotalFileSize) {
    return "The combined file upload must be 25 MB or smaller.";
  }

  const invalidFile = files.find((file) => !isAllowedQuoteFileType(file));

  if (invalidFile) {
    return "Please upload JPG, PNG, WebP, HEIC, HEIF, or PDF files only.";
  }

  return null;
}

function getRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getShortRandomId() {
  return getRandomId().replace(/-/g, "").slice(0, 8);
}

function slugifyQuotePart(value: string, fallback: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return slug || fallback;
}

export function getQuoteUploadFolder({
  address,
  firstName,
  lastName,
}: QuoteUploadFolderInput) {
  const datePath = new Date().toISOString().slice(0, 10);
  const personSlug = slugifyQuotePart(
    [firstName, lastName].filter(Boolean).join(" "),
    "unknown-contact",
  );
  const addressSlug = slugifyQuotePart(address, "unknown-address");

  return `quote-requests/${datePath}/${personSlug}-${addressSlug}-${getShortRandomId()}`;
}

export function getQuoteUploadPath(folder: string, fileName: string) {
  const safeName = sanitizeQuoteFileName(fileName);

  return `${folder}/${safeName}`;
}

export function isQuoteUploadPath(pathname: string) {
  const parts = pathname.split("/");
  const fileName = parts.at(-1) ?? "";

  return (
    parts[0] === "quote-requests" &&
    /^\d{4}-\d{2}-\d{2}$/.test(parts[1] ?? "") &&
    parts.length === 4 &&
    /^[a-z0-9-]{3,180}$/.test(parts[2] ?? "") &&
    isAllowedQuoteFileType({
      name: fileName,
      size: 0,
      type: "",
    })
  );
}

export function isSafeQuoteBlobUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".blob.vercel-storage.com") &&
      url.pathname.includes("/quote-requests/")
    );
  } catch {
    return false;
  }
}
