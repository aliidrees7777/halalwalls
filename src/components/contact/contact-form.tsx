"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ChevronDown, Send } from "lucide-react";
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
  "w-full rounded-[7px] border border-[#3E4446] bg-[#181A1B] px-4 text-sm text-white outline-none transition-colors focus:border-[#05DF8B] placeholder:text-[#B2ACA2]/50";

export function ContactForm() {
  const [reason, setReason] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      {submitted && (
        <p
          role="status"
          className="rounded-[7px] border border-[#4D853A]/50 bg-[#4D853A]/15 px-4 py-3 text-sm text-[#7ed957]"
        >
          Thanks! Your message has been sent (demo).
        </p>
      )}

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
        <label htmlFor="contact-reason" className="text-sm font-semibold text-white">
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
              reason ? "text-white" : "text-[#B2ACA2]/80"
            )}
          >
            <option value="" disabled>
              Select a reason
            </option>
            {REASONS.map((r) => (
              <option key={r} value={r} className="bg-[#181A1B] text-white">
                {r}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-[#B2ACA2]" />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className="text-sm font-semibold text-white">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          required
          placeholder="Email"
          className={cn(fieldBox, "h-12")}
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-details" className="text-sm font-semibold text-white">
          Details <span className="text-red-400">*</span>
        </label>
        <textarea
          id="contact-details"
          required
          placeholder="Details"
          rows={5}
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
          disabled={!captchaToken}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[7px] bg-[#4D853A] px-5 text-sm font-semibold text-white transition-[filter,transform] hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send Message
          <Send className="size-4" />
        </button>
      </div>
    </form>
  );
}
