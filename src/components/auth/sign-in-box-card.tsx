"use client";

import Link from "next/link";
import { BadgeCheck, CornerDownRight } from "lucide-react";

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
  return (
    <div
      className="relative z-10 my-auto w-full max-w-[400px] rounded-2xl border-2 border-[#05DF8B] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md sm:p-7"
      style={{ background: "rgba(24, 26, 27, 0.77)" }}
    >
      <div className="flex flex-col gap-5">
        {/* Title */}
        <h1 className="text-center text-[22px] font-bold leading-tight text-white">
          Sign in
        </h1>

        {/* Feature box */}
        <div className="rounded-2xl border border-[#05DF8B] bg-[#181A1B] p-5">
          <h2 className="text-[15px] font-semibold text-white">
            Start Your Journey With HalalWalls
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {FEATURES.map((label) => (
              <li key={label} className="flex items-center gap-2.5">
                <BadgeCheck className="size-[22px] shrink-0 text-white" fill="#06DD8A" strokeWidth={2} />
                <span className="text-sm font-light text-white">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {/* Sign in with Google */}
          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full bg-[#05DF8B] text-[15px] font-bold text-[#181A1B] transition-[filter,transform] hover:brightness-95 active:translate-y-px"
          >
            <span className="grid size-5 place-items-center rounded-full bg-white">
              <svg viewBox="0 0 24 24" className="size-3.5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
              </svg>
            </span>
            Sign in with Google
          </button>

          {/* Continue with Email */}
          <Link
            href="/signin"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#181A1B] text-sm font-semibold text-[#A8A299] transition-colors hover:bg-[#1f2122] active:translate-y-px"
          >
            <CornerDownRight className="size-[18px]" />
            Continue with Email
          </Link>

          {/* or */}
          <span className="text-center text-[13px] font-semibold text-[#A8A299] opacity-70">or</span>

          {/* Create an account */}
          <Link
            href="/signup"
            className="flex h-11 w-full items-center justify-center rounded-full bg-[#42494E] text-sm font-semibold text-[#A8A299] transition-colors hover:bg-[#4c5358] active:translate-y-px"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
