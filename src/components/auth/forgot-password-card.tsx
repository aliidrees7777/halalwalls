"use client";

import Link from "next/link";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";

/**
 * Forgot Password card.
 * Matches the Figma "Forgot password" frame — colors, fonts, layout — at the
 * same compact platform scale as Sign In / Sign Up (h-10 inputs/buttons,
 * text-sm, ~13px labels, rounded-lg, 400px width). No cross.
 * Palette from Figma CSS: card rgba(24,26,27,0.77) · border #05DF8B ·
 * input #181A1B / #3E4446 · placeholder #B2ACA2@50% · description/footer #65635F ·
 * primary #05DF8B / text #181A1B · "Log in" link #69A6D5.
 */
export function ForgotPasswordCard() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const data = await api.post<{ message?: string }>("/auth/forgot-password", { email });
      setMessage(data?.message || "If that email exists, a recovery link has been sent.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="relative z-10 my-auto w-full max-w-[400px] rounded-2xl border-2 border-[#05DF8B] bg-hw-card/[0.77] p-6 backdrop-blur-md sm:p-7"
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        {message && (
          <p
            role="status"
            className="rounded-lg border border-[#05DF8B]/40 bg-[#05DF8B]/10 px-3 py-2 text-center text-sm text-[#05DF8B]"
          >
            {message}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-400"
          >
            {error}
          </p>
        )}
        {/* Title + description */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-center text-[22px] font-bold leading-tight text-hw-foreground">
            Forgot Password?
          </h1>
          <p className="mx-auto max-w-[300px] text-center text-[13px] leading-relaxed text-hw-faint">
            If you forgot your password, please enter your email below and we will
            send you a recovery link.
          </p>
        </div>

        {/* Email field */}
        <div className="space-y-1.5">
          <label htmlFor="forgot-email" className="block text-[13px] font-semibold text-hw-foreground">
            Email Address
          </label>
          <div className="flex h-10 items-center rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-[#05DF8B]">
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-transparent text-sm text-hw-foreground outline-none placeholder:text-hw-faint/50"
            />
          </div>
        </div>

        {/* Primary: Send Recovery Link */}
        <button
          type="submit"
          disabled={submitting}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#05DF8B] text-[15px] font-bold text-hw-input transition-[filter,transform] hover:brightness-95 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Please wait…" : "Send Recovery Link"}
          {!submitting && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
              <path d="M3 11l18-8-8 18-2.5-7.5L3 11z" />
            </svg>
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-[13px] text-hw-faint">
          Remember your password?{" "}
          <Link href="/signin" className="text-[#69A6D5] underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
