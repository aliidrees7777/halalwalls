"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";
import Image from "next/image";
import close from "../../../public/authicon/close.svg";


/**
 * Sign In (Login via Email) card.
 * Matches the Figma "Login via Email" frame (colors, fonts, weights, layout)
 * but sized to the existing platform's compact conventions — h-10 inputs,
 * text-sm, ~12px labels, rounded-lg — so it fits a 100% laptop screen without
 * scrolling. Palette from Figma CSS:
 * card rgba(24,26,27,0.77) · border #05DF8B · inputs #181A1B / #3E4446 ·
 * placeholder #B2ACA2@50% · forgot #69A6D5 · primary #05DF8B / text #181A1B ·
 * "or" + google text #A8A299.
 */
export function SignInCard() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="relative z-10 flex justify-center items-center my-auto w-full max-w-[825px] h-[600px] rounded-2xl border-2 border-[#05DF8B] bg-hw-card/[0.77] p-6 backdrop-blur-md sm:p-7"
    >
        <button
        onClick={() => router.back()}
        className="absolute top-4 right-6 text-2xl font-bold text-hw-depw hover:text-white transition-colors cursor-pointer"
      >
        <Image src={close} alt="Close" width={20} height={20} />
      </button>
      <form
        className="flex flex-col gap-12 w-xl"
        onSubmit={handleSubmit}
      >
        {/* Title */}
        <h1 className="text-center text-[31px] font-bold leading-tight text-hw-depw">
          Sign In
        </h1>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-400"
          >
            {error}
          </p>
        )}

        {/* Fields + forgot link */}
        <div className="flex flex-col gap-3.5">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="signin-email" className="block text-[19px] font-semibold text-hw-depw">
              Email Address
            </label>
            <div className="flex h-12 items-center rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-[#05DF8B]">
              <input
                id="signin-email"
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-lg text-hw-depw outline-none placeholder:text-hw-faint/50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="signin-password" className="block text-[19px] font-semibold text-hw-depw">
              Password
            </label>
            <div className="flex h-12 items-center gap-2 rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-[#05DF8B]">
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 bg-transparent text-lg text-hw-depw outline-none placeholder:text-hw-faint/50"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="grid size-5 shrink-0 place-items-center text-hw-faint opacity-70 transition-opacity hover:opacity-100"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-full">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <path d="m2 2 20 20" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-full">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <a href="/forgot-password" className="text-[13px] font-[450px] text-[#69A6D5] underline">
            Forgot your password?
          </a>
        </div>

        {/* Login buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#05DF8B] text-[22px] font-bold text-hw-input transition-[filter,transform] hover:brightness-95 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>@</span>
            {submitting ? "Please wait…" : "Sign in with Email"}
          </button>

          <span className="text-center text-[14px] font-semibold text-hw-faint opacity-70">or</span>

          <button
            type="button"
            onClick={() => setError("Google sign-in will be enabled soon.")}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-hw-input text-[18px] font-semibold text-hw-faint transition-colors hover:bg-hw-pill2-hover active:translate-y-px"
          >
            <svg viewBox="0 0 24 24" className="size-[18px]">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
            </svg>
            Continue with Google
          </button>
        </div>
      </form>
    </div>
  );
}
