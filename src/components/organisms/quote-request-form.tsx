"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/atoms/button";

type FormStatus =
  | { message: string; type: "error" | "success" }
  | { message: ""; type: "idle" };

const initialStatus: FormStatus = {
  message: "",
  type: "idle",
};

export function QuoteRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>(initialStatus);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(initialStatus);

    const formData = new FormData(event.currentTarget);
    const payload = {
      address: String(formData.get("address") ?? ""),
      company: String(formData.get("company") ?? ""),
      email: String(formData.get("email") ?? ""),
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      message: String(formData.get("message") ?? ""),
      page: "/contact",
      phone: String(formData.get("phone") ?? ""),
      source: "Website",
      subject: String(formData.get("subject") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/quote", {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const result = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "The quote request could not be sent.");
      }

      event.currentTarget.reset();
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
    }
  }

  return (
    <form
      className="surface-panel grid gap-5 rounded-lg p-6 sm:p-8"
      onSubmit={handleSubmit}
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
          className="field-control cursor-not-allowed py-3 text-muted file:mr-4 file:rounded-full file:border-0 file:bg-spicy-orange file:px-4 file:py-2 file:text-sm file:font-extrabold file:text-white file:shadow-[0_10px_24px_rgba(227,65,15,0.18)]"
          disabled
          multiple
          name="files"
          type="file"
        />
        <span className="text-xs font-bold leading-5 text-muted">
          File uploads will be connected after storage is enabled.
        </span>
      </label>

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
        {isSubmitting ? "Sending..." : "Send Request"}
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
