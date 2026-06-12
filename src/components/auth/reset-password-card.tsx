"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { api, ApiError } from "@/lib/api";

/**
 * Reset Password card.
 * Mirrors the Forgot Password / Sign In cards — colors, fonts, layout — at the
 * same compact platform scale (h-10 inputs/buttons, text-sm, ~13px labels,
 * rounded-lg, 400px width).
 * Palette: card rgba(24,26,27,0.77) · border #05DF8B · input #181A1B / #3E4446 ·
 * placeholder #B2ACA2@50% · description/footer #65635F ·
 * primary #05DF8B / text #181A1B · "Sign in" link #69A6D5.
 */
export function ResetPasswordCard() {
  const token = useSearchParams().get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const missingToken = !token;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (missingToken) {
      setError("Invalid or missing reset link.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative z-10 my-auto w-full max-w-[400px] rounded-2xl border-2 border-[#05DF8B] bg-hw-card/[0.77] p-6 backdrop-blur-md sm:p-7">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {success && (
          <p
            role="status"
            className="rounded-lg border border-[#05DF8B]/40 bg-[#05DF8B]/10 px-3 py-2 text-center text-sm text-[#05DF8B]"
          >
            Password reset! You can now sign in.
          </p>
        )}
        {missingToken && !success && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-400"
          >
            Invalid or missing reset link.
          </p>
        )}
        {error && !success && !missingToken && (
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
            Reset Password
          </h1>
          <p className="mx-auto max-w-[300px] text-center text-[13px] leading-relaxed text-hw-faint">
            Enter a new password for your account below.
          </p>
        </div>

        {/* New Password field */}
        <div className="space-y-1.5">
          <label
            htmlFor="reset-new-password"
            className="block text-[13px] font-semibold text-hw-foreground"
          >
            New Password
          </label>
          <div className="flex h-10 items-center rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-[#05DF8B]">
            <input
              id="reset-new-password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={missingToken || success}
              className="w-full bg-transparent text-sm text-hw-foreground outline-none placeholder:text-hw-faint/50 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        {/* Confirm New Password field */}
        <div className="space-y-1.5">
          <label
            htmlFor="reset-confirm-password"
            className="block text-[13px] font-semibold text-hw-foreground"
          >
            Confirm New Password
          </label>
          <div className="flex h-10 items-center rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-[#05DF8B]">
            <input
              id="reset-confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={missingToken || success}
              className="w-full bg-transparent text-sm text-hw-foreground outline-none placeholder:text-hw-faint/50 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        {/* Primary: Reset Password */}
        <button
          type="submit"
          disabled={submitting || missingToken || success}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#05DF8B] text-[15px] font-bold text-hw-input transition-[filter,transform] hover:brightness-95 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Please wait…" : "Reset Password"}
        </button>

        {/* Footer */}
        <p className="text-center text-[13px] text-hw-faint">
          Remember your password?{" "}
          <Link href="/signin" className="text-[#69A6D5] underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
