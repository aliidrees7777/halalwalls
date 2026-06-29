"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ApiError } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

/**
 * Verify Email card.
 * Mirrors the Reset Password card (colors, fonts, layout, 400px width).
 * Reads ?token= from the verification link, confirms it on mount, and — for a
 * signed-in but still-unverified user — offers to resend the confirmation.
 */
export function VerifyEmailCard() {
  const token = useSearchParams().get("token");
  const { user, verifyEmail, resendVerification } = useAuth();

  const [state, setState] = useState<"verifying" | "success" | "error">(
    token ? "verifying" : "error",
  );
  const [message, setMessage] = useState(
    token ? "" : "Invalid or missing verification link.",
  );
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;
    (async () => {
      try {
        await verifyEmail(token);
        setState("success");
      } catch (err) {
        setState("error");
        setMessage(
          err instanceof ApiError
            ? err.message
            : "Verification failed. The link may have expired.",
        );
      }
    })();
  }, [token, verifyEmail]);

  async function handleResend() {
    setResent(false);
    setResending(true);
    try {
      await resendVerification();
      setResent(true);
    } catch (err) {
      setMessage(
        err instanceof ApiError
          ? err.message
          : "Couldn't resend. Please sign in and try again.",
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="relative z-10 my-auto w-full max-w-[400px] rounded-2xl border-2 border-[#05DF8B] bg-hw-card/[0.77] p-6 backdrop-blur-md sm:p-7">
      <div className="flex flex-col items-center gap-5 text-center">
        <h1 className="text-[22px] font-bold leading-tight text-hw-foreground">
          {state === "success"
            ? "Email verified"
            : state === "verifying"
              ? "Verifying your email…"
              : "Verification failed"}
        </h1>

        {state === "success" && (
          <p
            role="status"
            className="w-full rounded-lg border border-[#05DF8B]/40 bg-[#05DF8B]/10 px-3 py-2 text-sm text-[#05DF8B]"
          >
            Your email has been verified. You&apos;re all set!
          </p>
        )}
        {state === "verifying" && (
          <p className="text-[13px] text-hw-faint">Please wait a moment.</p>
        )}
        {state === "error" && (
          <p
            role="alert"
            className="w-full rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400"
          >
            {message}
          </p>
        )}

        {/* Resend — only for a signed-in, still-unverified user */}
        {state === "error" && user && !user.emailVerified && (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || resent}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#05DF8B] text-[15px] font-bold text-hw-input transition-[filter,transform] hover:brightness-95 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resent
              ? "Confirmation sent ✓"
              : resending
                ? "Please wait…"
                : "Resend confirmation email"}
          </button>
        )}

        <p className="text-[13px] text-hw-faint">
          {state === "success" ? (
            <Link href="/" className="text-[#69A6D5] underline">
              Go to HalalWalls
            </Link>
          ) : (
            <>
              Back to{" "}
              <Link href="/signin" className="text-[#69A6D5] underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
