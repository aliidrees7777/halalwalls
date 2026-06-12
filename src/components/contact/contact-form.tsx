"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ChevronDown, Send } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

/**
 * reCAPTCHA v2 site key. Uses NEXT_PUBLIC_RECAPTCHA_SITE_KEY in production;
 * falls back to Google's official public TEST key (always passes) so the real
 * widget works on localhost. Swap in a real key + server-side verification for
 * production.
 */
const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

/**
 * Contact Us form. Matches the Figma "Contact page" frame — colors, layout —
 * at the platform's web scale. Palette from Figma CSS:
 * notice box #2F2805 / border #6C4C0B / text #C1A36F ·
 * inputs #181A1B / border #3E4446 / radius ~7px · placeholder #B2ACA2 ·
 * send button #4D853A.
 */
const REASONS = [
  "Copyright / Image removal",
  "General inquiry",
  "Report a problem",
  "Feedback / Suggestion",
  "Business / Advertising",
  "Other",
];

const fieldBox =
  "w-full rounded-[7px] border border-hw-input-border bg-hw-input px-4 text-sm text-hw-foreground outline-none transition-colors focus:border-[#05DF8B] placeholder:text-hw-faint/50";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [reason, setReason] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const res = await api.post<{ id: string; status: string }>("/contact", {
        name,
        email,
        reason,
        message: details,
      });
      void res;
      setSuccess("Thanks! Your message has been received — we'll get back to you soon.");
      setName("");
      setEmail("");
      setDetails("");
      setReason("");
      setCaptchaToken(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
      {success && (
        <p
          role="status"
          className="rounded-[7px] border border-[#4D853A]/50 bg-[#4D853A]/15 px-4 py-3 text-sm text-[#7ed957]"
        >
          {success}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-[7px] border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {error}
        </p>
      )}

      {/* Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-name" className="text-sm font-semibold text-hw-foreground">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={cn(fieldBox, "h-12")}
        />
      </div>

      {/* Copyright notice */}
      <div className="rounded-[7px] border border-[#6C4C0B] bg-[#2F2805] px-5 py-4">
        <p className="text-sm leading-relaxed text-[#C1A36F]">
          All images remain property of their original owners. If you found any
          image copyrighted to you, please &lsquo;Contact Us&rsquo; so we can mention
          its author&rsquo;s name or remove it upon your decision. Feel free to
          contact us; we would love to hear from you.
        </p>
      </div>

      {/* Reason */}
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-reason" className="text-sm font-semibold text-hw-foreground">
          Reason <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <select
            id="contact-reason"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={cn(
              fieldBox,
              "h-12 appearance-none pr-11",
              reason ? "text-hw-foreground" : "text-hw-faint/80"
            )}
          >
            <option value="" disabled>
              Select a reason
            </option>
            {REASONS.map((r) => (
              <option key={r} value={r} className="bg-hw-input text-hw-foreground">
                {r}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-hw-faint" />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className="text-sm font-semibold text-hw-foreground">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(fieldBox, "h-12")}
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-details" className="text-sm font-semibold text-hw-foreground">
          Details <span className="text-red-400">*</span>
        </label>
        <textarea
          id="contact-details"
          required
          placeholder="Details"
          rows={5}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className={cn(fieldBox, "min-h-[140px] resize-y py-3 leading-relaxed")}
        />
      </div>

      {/* reCAPTCHA (real Google reCAPTCHA v2) */}
      <ReCAPTCHA
        sitekey={RECAPTCHA_SITE_KEY}
        theme="light"
        onChange={(token) => setCaptchaToken(token)}
        onExpired={() => setCaptchaToken(null)}
      />

      {/* Send */}
      <div>
        <button
          type="submit"
          disabled={!captchaToken || submitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[7px] bg-[#4D853A] px-5 text-sm font-semibold text-white transition-[filter,transform] hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send Message"}
          <Send className="size-4" />
        </button>
      </div>
    </form>
  );
}
