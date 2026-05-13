"use client";

import { upload } from "@vercel/blob/client";
import { X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/atoms/button";
import {
  acceptedQuoteFileTypes,
  getQuoteUploadPath,
  sanitizeQuoteFileName,
  validateQuoteFiles,
} from "@/lib/quote-files";

type FormStatus =
  | { message: string; type: "error" | "success" }
  | { message: ""; type: "idle" };

const initialStatus: FormStatus = {
  message: "",
  type: "idle",
};

function getFileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function QuoteRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState("Send Request");
  const [status, setStatus] = useState<FormStatus>(initialStatus);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(event.currentTarget.files ?? []);

    if (!newFiles.length) {
      return;
    }

    const nextFilesByKey = new Map(
      selectedFiles.map((file) => [getFileKey(file), file]),
    );

    newFiles.forEach((file) => {
      nextFilesByKey.set(getFileKey(file), file);
    });

    const nextFiles = Array.from(nextFilesByKey.values());
    const fileValidationError = validateQuoteFiles(nextFiles);

    if (fileValidationError) {
      setStatus({
        message: fileValidationError,
        type: "error",
      });
    } else {
      setSelectedFiles(nextFiles);
      setStatus(initialStatus);
    }

    event.currentTarget.value = "";
  }

  function handleRemoveFile(fileKey: string) {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter((file) => getFileKey(file) !== fileKey),
    );
    setStatus(initialStatus);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setStatus(initialStatus);

    const formData = new FormData(form);
    const fileValidationError = validateQuoteFiles(selectedFiles);

    if (fileValidationError) {
      setIsSubmitting(false);
      setStatus({
        message: fileValidationError,
        type: "error",
      });
      return;
    }

    try {
      setSubmitLabel(selectedFiles.length ? "Uploading files..." : "Sending...");

      const uploadedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const blob = await upload(getQuoteUploadPath(file.name), file, {
            access: "public",
            contentType: file.type || undefined,
            handleUploadUrl: "/api/quote/upload",
          });

          return {
            name: sanitizeQuoteFileName(file.name),
            size: file.size,
            type: file.type || "application/octet-stream",
            url: blob.url,
          };
        }),
      );

      setSubmitLabel("Sending...");

      const response = await fetch("/api/quote", {
        body: JSON.stringify({
          address: String(formData.get("address") ?? ""),
          company: String(formData.get("company") ?? ""),
          email: String(formData.get("email") ?? ""),
          files: uploadedFiles,
          firstName: String(formData.get("firstName") ?? ""),
          lastName: String(formData.get("lastName") ?? ""),
          message: String(formData.get("message") ?? ""),
          page: "/contact",
          phone: String(formData.get("phone") ?? ""),
          source: "Website",
          subject: String(formData.get("subject") ?? ""),
          website: String(formData.get("website") ?? ""),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const result = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "The quote request could not be sent.");
      }

      formRef.current?.reset();
      setSelectedFiles([]);
      setStatus({
        message: "Thanks. Your quote request has been sent.",
        type: "success",
      });
    } catch (error) {
      setStatus({
        message:
          error instanceof Error
            ? error.message
            : "The quote request could not be sent.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      setSubmitLabel("Send Request");
    }
  }

  return (
    <form
      className="surface-panel grid gap-5 rounded-lg p-6 sm:p-8"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <label className="sr-only">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="field-label">
        Subject
        <input
          className="field-control"
          name="subject"
          placeholder="e.g. Exterior plastering quote"
          required
        />
      </label>

      <label className="field-label">
        Message
        <textarea
          className="field-control min-h-40 py-3"
          name="message"
          placeholder="Tell us about the property, finish, timeline, and access notes."
          required
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field-label">
          First name
          <input className="field-control" name="firstName" required />
        </label>
        <label className="field-label">
          Last name
          <input className="field-control" name="lastName" required />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field-label">
          Email
          <input
            autoComplete="email"
            className="field-control"
            name="email"
            required
            type="email"
          />
        </label>
        <label className="field-label">
          Phone
          <input
            autoComplete="tel"
            className="field-control"
            name="phone"
            required
            type="tel"
          />
        </label>
      </div>

      <label className="field-label">
        Company
        <input
          autoComplete="organization"
          className="field-control"
          name="company"
        />
      </label>

      <label className="field-label">
        Address
        <input
          autoComplete="street-address"
          className="field-control"
          name="address"
          placeholder="Property address"
          required
        />
      </label>

      <label className="field-label">
        Add files
        <input
          accept={acceptedQuoteFileTypes}
          className="field-control cursor-pointer py-3 text-muted file:mr-4 file:rounded-full file:border-0 file:bg-spicy-orange file:px-4 file:py-2 file:text-sm file:font-extrabold file:text-white file:shadow-[0_10px_24px_rgba(227,65,15,0.18)]"
          disabled={isSubmitting}
          multiple
          name="files"
          onChange={handleFileChange}
          ref={fileInputRef}
          type="file"
        />
        <span className="text-xs font-bold leading-5 text-muted">
          Add photos, plans, or PDFs one batch at a time. Up to 5 files, 10 MB
          each.
        </span>
      </label>

      {selectedFiles.length ? (
        <div className="grid gap-2" aria-live="polite">
          {selectedFiles.map((file) => {
            const fileKey = getFileKey(file);

            return (
              <div
                className="flex items-center justify-between gap-3 rounded-md border border-[var(--field-border)] bg-[var(--field-background)] px-3 py-2 text-sm text-foreground shadow-sm"
                key={fileKey}
              >
                <span className="min-w-0">
                  <span className="block truncate font-extrabold">
                    {sanitizeQuoteFileName(file.name)}
                  </span>
                  <span className="text-xs font-bold text-muted">
                    {formatFileSize(file.size)}
                  </span>
                </span>
                <button
                  aria-label={`Remove ${file.name}`}
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-[var(--field-border)] text-muted transition hover:border-spicy-orange hover:text-spicy-orange disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                  onClick={() => handleRemoveFile(fileKey)}
                  type="button"
                >
                  <X aria-hidden="true" size={16} strokeWidth={2.4} />
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {status.message ? (
        <p
          className={`rounded-md px-4 py-3 text-sm font-extrabold ${
            status.type === "success"
              ? "bg-oxide-green/12 text-oxide-green"
              : "bg-spicy-orange/12 text-spicy-orange"
          }`}
          role="status"
        >
          {status.message}
        </p>
      ) : null}

      <Button className="w-full sm:w-fit" disabled={isSubmitting} type="submit">
        {isSubmitting ? submitLabel : "Send Request"}
      </Button>
      <p className="text-xs font-bold leading-5 text-muted">
        By submitting this request, you acknowledge our{" "}
        <Link
          className="font-black text-spicy-orange underline-offset-4 hover:underline"
          href="/terms-of-service"
        >
          Terms of Service
        </Link>
        .
      </p>
    </form>
  );
}
