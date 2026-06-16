"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, CornerDownRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";
import Image from "next/image";
import close from "../../../public/authicon/close.svg";
import badgecheck from "../../../public/authicon/badgecheck.svg";

/**
 * Sign in Box — the main sign-in chooser (Google-first) with the feature list.
 * Matches the Figma "Sign in Box" frame — colors, fonts, layout — at the
 * compact platform scale used across the auth screens. No cross.
 * Palette from Figma CSS: card rgba(24,26,27,0.77) · border #05DF8B ·
 * feature box #181A1B w/ #05DF8B border · check badges #06DD8A ·
 * Google btn #05DF8B / text #181A1B · "Continue with Email" #181A1B / #A8A299 ·
 * "Create an account" #42494E / #A8A299.
 */
const FEATURES = [
  "Save Favorites",
  "Sync Across Devices",
  "Personalized Suggestions",
  "View History",
  "Easy Downloads",
  "Upload Wallpapers",
];

export function SignInBoxCard() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // async function handleSubmit(e: React.FormEvent) {
  //   e.preventDefault();
  //   setError(null);
  //   setSubmitting(true);
  //   try {
  //     await login(email, password);
  //     router.push("/");
  //   } catch (err) {
  //     setError(err instanceof ApiError ? err.message : "Something went wrong.");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // }

  return (
    <div className="relative flex flex-col justify-center items-center z-10 my-auto w-full max-w-[825px] h-[805px] rounded-2xl border-2 border-[#05DF8B] bg-hw-card/[0.77] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md sm:p-7">
      <button
        onClick={() => router.back()}
        className="absolute top-4 right-6 text-2xl font-bold text-hw-depw hover:text-white transition-colors cursor-pointer"
      >
        <Image src={close} alt="Close" width={20} height={20} />
      </button>
      <div className="flex flex-col gap-12 w-md ">
        <h1 className="text-center text-[31px] font-bold leading-tight text-hw-depw">
          Sign in
        </h1>
        {/* Feature box */}
        <div className="rounded-2xl border border-[#05DF8B] bg-hw-header p-10 ">
          <h2 className="text-[20px] font-semibold text-hw-depw">
            Start Your Journey With HalalWalls
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {FEATURES.map((label) => (
              <li key={label} className="flex items-center gap-2.5">
            <Image src={badgecheck} alt="Close" width={25} height={25} />
                <span className="text-[20px] font-light text-hw-depw">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Error banner */}
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-400"
          >
            {error}
          </p>
        )}

        {/* Email + password sign-in
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="signin-email" className="block text-[13px] font-semibold text-hw-foreground">
              Email Address
            </label>
            <div className="flex h-11 items-center rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-[#05DF8B]">
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-transparent text-sm text-hw-foreground outline-none placeholder:text-hw-faint/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="signin-password" className="block text-[13px] font-semibold text-hw-foreground">
              Password
            </label>
            <div className="flex h-11 items-center rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-[#05DF8B]">
              <input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm text-hw-foreground outline-none placeholder:text-hw-faint/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#05DF8B] text-[15px] font-bold text-hw-input transition-[filter,transform] hover:brightness-95 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Please wait…" : "Sign in"}
          </button>
        </form> */}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {/* Sign in with Google */}
          <button
            type="button"
            onClick={() => setError("Google sign-in will be enabled soon.")}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#05DF8B] text-[22px] font-bold text-hw-input transition-[filter,transform] hover:brightness-95 active:translate-y-px"
          >
            <span className="grid size-7 place-items-center rounded-full bg-white ">
              <svg viewBox="0 0 24 24" className="size-3.5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
                />
              </svg>
            </span>
            Sign in with Google
          </button>

          {/* Continue with Email */}
          <Link
            href="/signin"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-hw-input text-lg font-semibold text-hw-foreground transition-colors hover:bg-hw-pill2-hover active:translate-y-px"
          >
            <CornerDownRight className="size-[15px]" />
            Continue with Email
          </Link>

          {/* or */}
          <span className="text-center text-[15px] font-semibold text-hw-foreground opacity-70">
            or
          </span>

          {/* Create an account */}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="flex h-11 w-full items-center justify-center rounded-full bg-hw-pill2 text-sm font-semibold text-hw-foreground transition-colors hover:bg-hw-pill2-hover active:translate-y-px"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
