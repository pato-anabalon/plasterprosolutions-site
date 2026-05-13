import {
  getQuoteFileExtension,
  getQuoteUploadFileName,
  getQuoteUploadFolder,
  getQuoteUploadPath,
  isAllowedQuoteFileType,
  isQuoteUploadPath,
  isSafeQuoteBlobUrl,
  quoteFileConfig,
  sanitizeQuoteFileName,
  validateQuoteFiles,
} from "./quote-files";

const validFile = {
  name: "photo.jpg",
  size: 1024,
  type: "image/jpeg",
};

describe("quote file helpers", () => {
  describe("sanitizeQuoteFileName", () => {
    it.each([
      ["Project Plan 01.pdf", "Project-Plan-01.pdf"],
      ["../private/photo one.jpg", "photo-one.jpg"],
      ["", "attachment"],
      ["...hidden.png", "hidden.png"],
    ])("should sanitize %s as %s", (input, expected) => {
      expect(sanitizeQuoteFileName(input)).toBe(expected);
    });
  });

  describe("getQuoteFileExtension", () => {
    it.each([
      ["photo.JPG", ".jpg"],
      ["quote.plan.final.pdf", ".pdf"],
      ["no-extension", ""],
    ])("should return the extension for %s", (input, expected) => {
      expect(getQuoteFileExtension(input)).toBe(expected);
    });
  });

  describe("isAllowedQuoteFileType", () => {
    it.each([
      [{ name: "photo.jpg", size: 100, type: "image/jpeg" }, true],
      [{ name: "image.heic", size: 100, type: "image/heic" }, true],
      [{ name: "plan.pdf", size: 100, type: "application/pdf" }, true],
      [{ name: "photo.jpg", size: 100, type: "image/png" }, false],
      [{ name: "script.exe", size: 100, type: "application/octet-stream" }, false],
    ])("should return %s for file type validation", (file, expected) => {
      expect(isAllowedQuoteFileType(file)).toBe(expected);
    });
  });

  describe("validateQuoteFiles", () => {
    it("should return null for a valid file list", () => {
      expect(validateQuoteFiles([validFile])).toBeNull();
    });

    it("should return null for an empty file list", () => {
      expect(validateQuoteFiles([])).toBeNull();
    });

    it("should reject more than the maximum number of files", () => {
      const files = Array.from(
        { length: quoteFileConfig.maxFiles + 1 },
        (_, index) => ({
          ...validFile,
          name: `photo-${index}.jpg`,
        }),
      );

      expect(validateQuoteFiles(files)).toBe("Please upload no more than 5 files.");
    });

    it("should reject oversized files", () => {
      expect(
        validateQuoteFiles([
          {
            ...validFile,
            size: quoteFileConfig.maxFileSize + 1,
          },
        ]),
      ).toBe("Each file must be 10 MB or smaller.");
    });

    it("should reject total upload size over the configured maximum", () => {
      const files = Array.from({ length: 3 }, (_, index) => ({
        ...validFile,
        name: `photo-${index}.jpg`,
        size: Math.ceil(quoteFileConfig.maxTotalFileSize / 3) + 1,
      }));

      expect(validateQuoteFiles(files)).toBe(
        "The combined file upload must be 25 MB or smaller.",
      );
    });

    it("should reject unsupported file types", () => {
      expect(
        validateQuoteFiles([
          {
            name: "archive.zip",
            size: 100,
            type: "application/zip",
          },
        ]),
      ).toBe("Please upload JPG, PNG, WebP, HEIC, HEIF, or PDF files only.");
    });
  });

  describe("getQuoteUploadFolder", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-13T12:00:00.000Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should build a dated folder with contact and address slugs", () => {
      const folder = getQuoteUploadFolder({
        address: "5B Kegworth Place, Auckland, 0630, New Zealand",
        firstName: "Patricio",
        lastName: "Anabalon",
      });

      expect(folder).toMatch(
        /^quote-requests\/2026-05-13\/patricio-anabalon-5b-kegworth-place-auckland-0630-new-zealand-[a-z0-9]{8}$/,
      );
    });

    it("should use fallbacks when contact or address values are empty", () => {
      const folder = getQuoteUploadFolder({
        address: "",
        firstName: "",
        lastName: "",
      });

      expect(folder).toMatch(
        /^quote-requests\/2026-05-13\/unknown-contact-unknown-address-[a-z0-9]{8}$/,
      );
    });
  });

  describe("getQuoteUploadPath", () => {
    it("should append a sanitized filename to the quote folder", () => {
      expect(
        getQuoteUploadPath(
          "quote-requests/2026-05-13/patricio-anabalon-address-a1b2c3d4",
          "My Plan.pdf",
        ),
      ).toBe(
        "quote-requests/2026-05-13/patricio-anabalon-address-a1b2c3d4/My-Plan.pdf",
      );
    });
  });

  describe("getQuoteUploadFileName", () => {
    it.each([
      ["original-name.JPG", 0, "file-1.jpg"],
      ["plan.pdf", 1, "file-2.pdf"],
      ["no-extension", 2, "file-3"],
    ])("should build a sequential upload filename", (fileName, index, expected) => {
      expect(getQuoteUploadFileName(fileName, index)).toBe(expected);
    });
  });

  describe("isQuoteUploadPath", () => {
    it.each([
      [
        "quote-requests/2026-05-13/patricio-anabalon-address-a1b2c3d4/file-1.jpg",
        true,
      ],
      ["quote-requests/2026-05-13/file-1.jpg", false],
      [
        "quote-requests/2026-05-13/patricio-anabalon-address-a1b2c3d4/file-1.exe",
        false,
      ],
      [
        "quotes/2026-05-13/patricio-anabalon-address-a1b2c3d4/file-1.jpg",
        false,
      ],
    ])("should return %s for upload path validation", (pathname, expected) => {
      expect(isQuoteUploadPath(pathname)).toBe(expected);
    });
  });

  describe("isSafeQuoteBlobUrl", () => {
    it.each([
      [
        "https://store.public.blob.vercel-storage.com/quote-requests/2026-05-13/folder/file-1.jpg",
        true,
      ],
      ["https://example.com/quote-requests/2026-05-13/folder/file-1.jpg", false],
      ["not-a-url", false],
    ])("should return %s for safe Blob URL validation", (url, expected) => {
      expect(isSafeQuoteBlobUrl(url)).toBe(expected);
    });
  });
});
