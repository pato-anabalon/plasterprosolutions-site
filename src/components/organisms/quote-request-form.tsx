'use client';

import { upload } from '@vercel/blob/client';
import { ChevronDown, Mail, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/atoms/button';
import {
  type QuoteSendOutcome,
  type QuoteSendPhase,
  QuoteSendOverlay,
  useQuoteSendAnimation
} from '@/components/organisms/quote-send-overlay';
import { leadSourceOptions } from '@/lib/lead-source';
import {
  acceptedQuoteFileTypes,
  getQuoteUploadContentType,
  getQuoteUploadFileName,
  getQuoteUploadFolder,
  getQuoteUploadPath,
  sanitizeQuoteFileName,
  validateQuoteFiles
} from '@/lib/quote-files';

type FormStatus = { message: string; type: 'error' } | { message: ''; type: 'idle' };

type UploadedQuoteFile = {
  name: string;
  size: number;
  type: string;
  url: string;
};

type UploadCache = {
  files: UploadedQuoteFile[];
  selectionKey: string;
  uploadFolder: string;
};

const initialStatus: FormStatus = {
  message: '',
  type: 'idle'
};

const quoteFileUploadTimeoutMs = 45_000;
/** Long enough for the sheet to fold into a plane and take off. */
const defaultMinFlightMs = 2_600;

type QuoteRequestFormProps = {
  /** Shortest time the send animation flies before showing the outcome. */
  minFlightMs?: number;
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createSubmissionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getFileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

async function withUploadTimeout<T>(uploadPromise: Promise<T>, fileName: string) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new Error(
          `The upload timed out while sending ${sanitizeQuoteFileName(fileName)}. Please try again or send fewer files.`
        )
      );
    }, quoteFileUploadTimeoutMs);
  });

  try {
    return await Promise.race([uploadPromise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export function QuoteRequestForm({
  minFlightMs = defaultMinFlightMs
}: QuoteRequestFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  // Kept across retries of the same request so the CRM never creates it twice;
  // renewed only once a request has gone through.
  const submissionIdRef = useRef<string | null>(null);
  // Files already uploaded for the current selection, so a retry doesn't send
  // them to Blob a second time.
  const uploadCacheRef = useRef<UploadCache | null>(null);
  const resetOnCloseRef = useRef(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [phase, setPhase] = useState<QuoteSendPhase>('idle');
  const [outcome, setOutcome] = useState<QuoteSendOutcome | null>(null);
  const [caption, setCaption] = useState('');
  const [sendError, setSendError] = useState('');
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const isSubmitting = phase !== 'idle';

  useQuoteSendAnimation({
    buttonRef: submitButtonRef,
    formRef,
    onClosed: handleClosed,
    phase
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(event.currentTarget.files ?? []);

    if (!newFiles.length) {
      return;
    }

    const nextFilesByKey = new Map(selectedFiles.map((file) => [getFileKey(file), file]));

    newFiles.forEach((file) => {
      nextFilesByKey.set(getFileKey(file), file);
    });

    const nextFiles = Array.from(nextFilesByKey.values());
    const fileValidationError = validateQuoteFiles(nextFiles);

    if (fileValidationError) {
      setStatus({
        message: fileValidationError,
        type: 'error'
      });
    } else {
      setSelectedFiles(nextFiles);
      setStatus(initialStatus);
    }

    event.currentTarget.value = '';
  }

  function handleRemoveFile(fileKey: string) {
    setSelectedFiles((currentFiles) => currentFiles.filter((file) => getFileKey(file) !== fileKey));
    setStatus(initialStatus);
  }

  async function uploadSelectedFiles(formData: FormData) {
    const selectionKey = selectedFiles.map(getFileKey).join('|');

    if (uploadCacheRef.current?.selectionKey === selectionKey) {
      return uploadCacheRef.current;
    }

    if (!selectedFiles.length) {
      return { files: [], selectionKey, uploadFolder: '' };
    }

    setCaption(selectedFiles.length === 1 ? 'Uploading your file...' : `Uploading ${selectedFiles.length} files...`);

    const uploadFolder = getQuoteUploadFolder({
      address: String(formData.get('address') ?? ''),
      firstName: String(formData.get('firstName') ?? ''),
      lastName: String(formData.get('lastName') ?? '')
    });

    const files = await Promise.all(
      selectedFiles.map(async (file, index) => {
        const uploadFileName = getQuoteUploadFileName(file.name, index);
        const blob = await withUploadTimeout(
          upload(getQuoteUploadPath(uploadFolder, uploadFileName), file, {
            access: 'public',
            contentType: getQuoteUploadContentType(file),
            handleUploadUrl: '/api/quote/upload'
          }),
          file.name
        );

        return {
          name: uploadFileName,
          size: file.size,
          type: file.type || 'application/octet-stream',
          url: blob.url
        };
      })
    );

    uploadCacheRef.current = { files, selectionKey, uploadFolder };
    return uploadCacheRef.current;
  }

  async function deliverQuoteRequest(formData: FormData) {
    const { files, uploadFolder } = await uploadSelectedFiles(formData);

    setCaption('Sending your request...');

    const response = await fetch('/api/quote', {
      body: JSON.stringify({
        address: String(formData.get('address') ?? ''),
        company: String(formData.get('company') ?? ''),
        email: String(formData.get('email') ?? ''),
        files,
        firstName: String(formData.get('firstName') ?? ''),
        lastName: String(formData.get('lastName') ?? ''),
        message: String(formData.get('message') ?? ''),
        page: '/contact',
        phone: String(formData.get('phone') ?? ''),
        source: String(formData.get('source') ?? ''),
        subject: String(formData.get('subject') ?? ''),
        submissionId: submissionIdRef.current,
        uploadFolder,
        website: String(formData.get('website') ?? '')
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
    const result = (await response.json()) as {
      error?: string;
      ok?: boolean;
    };

    if (!response.ok || !result.ok) {
      throw new Error(result.error ?? 'The quote request could not be sent.');
    }
  }

  async function sendQuoteRequest() {
    const form = formRef.current;

    if (!form) {
      return;
    }

    submissionIdRef.current ??= createSubmissionId();
    setSendError('');
    setCaption('Sending your request...');
    setPhase('sending');

    // The plane gets to take off even when the answer comes back instantly.
    const [delivery] = await Promise.allSettled([deliverQuoteRequest(new FormData(form)), wait(minFlightMs)]);

    if (delivery.status === 'fulfilled') {
      setOutcome('success');
      setPhase('success');
      return;
    }

    setSendError(delivery.reason instanceof Error ? delivery.reason.message : 'The quote request could not be sent.');
    setOutcome('error');
    setPhase('error');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(initialStatus);

    const fileValidationError = validateQuoteFiles(selectedFiles);

    if (fileValidationError) {
      setStatus({
        message: fileValidationError,
        type: 'error'
      });
      return;
    }

    await sendQuoteRequest();
  }

  function handleClose() {
    // Cleared while the overlay still hides it, so the form reappears empty.
    formRef.current?.reset();
    setSelectedFiles([]);
    submissionIdRef.current = null;
    uploadCacheRef.current = null;
    resetOnCloseRef.current = true;
    setPhase('closing');
  }

  function handleBackToForm() {
    resetOnCloseRef.current = false;
    setPhase('closing');
  }

  function handleClosed() {
    if (!resetOnCloseRef.current && sendError) {
      setStatus({ message: sendError, type: 'error' });
    }

    setOutcome(null);
    setPhase('idle');
    submitButtonRef.current?.focus();
  }

  return (
    <form
      className="surface-panel relative overflow-hidden rounded-lg"
      data-testid="quote-request-form"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <div className="grid gap-5 p-6 sm:p-8" inert={isSubmitting}>
        <label className="sr-only" data-testid="quote-request-form-honeypot">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>

        <label className="field-label" data-testid="quote-request-form-subject-field">
          Subject
          <input
            className="field-control"
            name="subject"
            data-testid="quote-request-form-subject-input"
            placeholder="e.g. Exterior plastering quote"
            required
          />
        </label>

        <label className="field-label" data-testid="quote-request-form-message-field">
          Message
          <textarea
            className="field-control min-h-40 py-3"
            name="message"
            data-testid="quote-request-form-message-input"
            placeholder="Tell us about the property, finish, timeline, and access notes."
            required
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="field-label" data-testid="quote-request-form-first-name-field">
            First name
            <input
              className="field-control"
              data-testid="quote-request-form-first-name-input"
              name="firstName"
              required
            />
          </label>
          <label className="field-label" data-testid="quote-request-form-last-name-field">
            Last name
            <input
              className="field-control"
              data-testid="quote-request-form-last-name-input"
              name="lastName"
              required
            />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="field-label" data-testid="quote-request-form-email-field">
            Email
            <input
              autoComplete="email"
              className="field-control"
              data-testid="quote-request-form-email-input"
              name="email"
              required
              type="email"
            />
          </label>
          <label className="field-label" data-testid="quote-request-form-phone-field">
            Phone
            <input
              autoComplete="tel"
              className="field-control"
              data-testid="quote-request-form-phone-input"
              name="phone"
              required
              type="tel"
            />
          </label>
        </div>

        <label className="field-label" data-testid="quote-request-form-company-field">
          Company
          <input
            autoComplete="organization"
            className="field-control"
            data-testid="quote-request-form-company-input"
            name="company"
          />
        </label>

        <label className="field-label" data-testid="quote-request-form-address-field">
          Address
          <input
            autoComplete="street-address"
            className="field-control"
            data-testid="quote-request-form-address-input"
            name="address"
            placeholder="Property address"
            required
          />
        </label>

        <label className="field-label" data-testid="quote-request-form-source-field">
          How did you hear about us?
          {/* The browser draws its own caret flush against the border and ignores
              padding; it is dropped and drawn here instead, where it can have room. */}
          <span className="relative block">
            <select
              className="field-control appearance-none pr-12"
              data-testid="quote-request-form-source-select"
              defaultValue=""
              name="source"
            >
              <option value="">Select an option</option>
              {leadSourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted"
              size={18}
              strokeWidth={2.4}
            />
          </span>
        </label>

        <label className="field-label" data-testid="quote-request-form-files-field">
          Add files
          <input
            accept={acceptedQuoteFileTypes}
            className="field-control cursor-pointer py-3 text-muted file:mr-4 file:rounded-full file:border-0 file:bg-spicy-orange file:px-4 file:py-2 file:text-sm file:font-extrabold file:text-white file:shadow-[0_10px_24px_rgba(227,65,15,0.18)]"
            data-testid="quote-request-form-files-input"
            disabled={isSubmitting}
            multiple
            name="files"
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />
          <span className="text-xs font-bold leading-5 text-muted">
            Add photos, plans, or PDFs one batch at a time. Up to 5 files, 10 MB each.
          </span>
        </label>

        {selectedFiles.length ? (
          <div className="grid gap-2" data-testid="quote-request-form-file-list" aria-live="polite">
            {selectedFiles.map((file) => {
              const fileKey = getFileKey(file);

              return (
                <div
                  className="flex items-center justify-between gap-3 rounded-md border border-[var(--field-border)] bg-[var(--field-background)] px-3 py-2 text-sm text-foreground shadow-sm"
                  data-testid="quote-request-form-file-item"
                  key={fileKey}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-extrabold">{sanitizeQuoteFileName(file.name)}</span>
                    <span className="text-xs font-bold text-muted">{formatFileSize(file.size)}</span>
                  </span>
                  <button
                    aria-label={`Remove ${file.name}`}
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-[var(--field-border)] text-muted transition hover:border-spicy-orange hover:text-spicy-orange disabled:cursor-not-allowed disabled:opacity-50"
                    data-testid="quote-request-form-remove-file"
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
            className="rounded-md bg-spicy-orange/12 px-4 py-3 text-sm font-extrabold text-spicy-orange"
            data-testid="quote-request-form-status"
            role="status"
          >
            {status.message}
          </p>
        ) : null}

        <Button
          className="relative w-full overflow-hidden sm:w-fit"
          data-testid="quote-request-form-submit"
          disabled={isSubmitting}
          ref={submitButtonRef}
          type="submit"
        >
          <span data-send="label">Send Request</span>
          <Mail
            aria-hidden="true"
            className="invisible absolute inset-0 m-auto opacity-0"
            data-send="envelope"
            size={20}
            strokeWidth={2.4}
          />
        </Button>
      </div>

      <QuoteSendOverlay
        caption={caption}
        errorMessage={sendError}
        onBackToForm={handleBackToForm}
        onClose={handleClose}
        onRetry={sendQuoteRequest}
        outcome={outcome}
        phase={phase}
      />
    </form>
  );
}
