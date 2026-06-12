export type CustomerReview = {
  body: string;
  date: string;
  name: string;
  rating: string;
  title: string;
};

type NoCowboysRating = {
  date?: unknown;
  description?: unknown;
  rating?: unknown;
  username?: unknown;
};

type NoCowboysResponse = {
  data?: unknown;
};

const noCowboysRatingsUrl =
  "https://www.nocowboys.co.nz/ajax/get-business-ratings/id/109829/type/microdata?review=all&page=1&per_page=20";

const maxReviewTitleLength = 72;

export async function fetchLatestNoCowboysReviews() {
  const response = await fetch(noCowboysRatingsUrl, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("NoCowboys reviews could not be loaded.");
  }

  const payload = (await response.json()) as NoCowboysResponse;

  return parseNoCowboysReviews(payload);
}

export function parseNoCowboysReviews(payload: NoCowboysResponse) {
  const rows = Array.isArray(payload.data)
    ? (payload.data as NoCowboysRating[])
    : [];

  return rows
    .filter((row) => Number(row.rating) === 100)
    .map(toCustomerReview)
    .filter(Boolean)
    .slice(0, 3) as CustomerReview[];
}

function toCustomerReview(row: NoCowboysRating) {
  const description = cleanReviewText(row.description);
  const name = cleanReviewText(row.username) || "NoCowboys customer";
  const date = cleanReviewText(row.date);

  if (!description || !date) {
    return null;
  }

  const title = createReviewTitle(description, name);
  const body = createReviewBody(description, title);

  return {
    body,
    date,
    name,
    rating: "100%",
    title,
  };
}

function createReviewTitle(description: string, name: string) {
  const [firstSentence] = description.match(/[^.!?]+[.!?]?/) ?? [];
  const title = firstSentence?.trim() || `Review from ${name}`;

  return truncateText(title, maxReviewTitleLength);
}

function createReviewBody(description: string, title: string) {
  const body = description.startsWith(title)
    ? description.slice(title.length).trim()
    : description;

  return body || description;
}

function cleanReviewText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return normalizeReviewWhitespace(
    decodeHtmlEntities(
      value
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
        .replace(/<\/?p[^>]*>/gi, "\n\n")
        .replace(/<[^>]*>/g, " "),
    ),
  );
}

function normalizeReviewWhitespace(value: string) {
  return (
    value
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t\f\v]+/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

function decodeHtmlEntities(value: string) {
  return value.replace(/&(#\d+|#x[\da-f]+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    const normalized = String(entity).toLowerCase();

    if (normalized.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16));
    }

    if (normalized.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10));
    }

    const namedEntities: Record<string, string> = {
      amp: "&",
      apos: "'",
      gt: ">",
      lt: "<",
      nbsp: " ",
      quot: '"',
    };

    return namedEntities[normalized] ?? match;
  });
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");

  return `${truncated.slice(0, lastSpace > 40 ? lastSpace : truncated.length).trim()}...`;
}
