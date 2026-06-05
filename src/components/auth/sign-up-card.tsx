"use client";

import { useState } from "react";
import { Eye, EyeOff, Rocket, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Sign Up ("Join Us in a Snap") card.
 * Matches the Figma "Sign up section" frame — colors, fonts, layout — at the
 * same compact platform scale as the Sign In card (h-10 inputs, text-sm,
 * ~13px labels, rounded-lg, 400px width). Palette from Figma CSS:
 * card rgba(24,26,27,0.77) · border #05DF8B · inputs #181A1B / #3E4446 ·
 * placeholder #B2ACA2@50% · terms links #69A6D5 · primary #05DF8B / text #181A1B.
 */
export function SignUpCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  return (
    <div
      className="relative z-10 my-auto w-full max-w-[400px] rounded-2xl border-2 border-[#05DF8B] p-6 backdrop-blur-md sm:p-7"
      style={{ background: "rgba(24, 26, 27, 0.77)" }}
    >
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        {/* Title */}
        <h1 className="text-center text-[22px] font-bold leading-tight text-white">
          Join Us in a Snap
        </h1>

        {/* Fields */}
        <div className="flex flex-col gap-3.5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="signup-name" className="block text-[13px] font-semibold text-white">
              Full Name
            </label>
            <div className="flex h-10 items-center rounded-lg border border-[#3E4446] bg-[#181A1B] px-3 transition-colors focus-within:border-[#05DF8B]">
              <input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#B2ACA2]/50"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="signup-email" className="block text-[13px] font-semibold text-white">
              Email Address
            </label>
            <div className="flex h-10 items-center rounded-lg border border-[#3E4446] bg-[#181A1B] px-3 transition-colors focus-within:border-[#05DF8B]">
              <input
                id="signup-email"
                type="email"
                placeholder="example@site.com"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#B2ACA2]/50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="signup-password" className="block text-[13px] font-semibold text-white">
              Password
            </label>
            <div className="flex h-10 items-center gap-2 rounded-lg border border-[#3E4446] bg-[#181A1B] px-3 transition-colors focus-within:border-[#05DF8B]">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#B2ACA2]/50"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="grid size-5 shrink-0 place-items-center text-[#65635F] opacity-70 transition-opacity hover:opacity-100"
              >
                {showPassword ? <EyeOff className="size-full" /> : <Eye className="size-full" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="signup-confirm" className="block text-[13px] font-semibold text-white">
              Confirm Password
            </label>
            <div className="flex h-10 items-center gap-2 rounded-lg border border-[#3E4446] bg-[#181A1B] px-3 transition-colors focus-within:border-[#05DF8B]">
              <input
                id="signup-confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Minimum 8 characters"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#B2ACA2]/50"
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((s) => !s)}
                className="grid size-5 shrink-0 place-items-center text-[#65635F] opacity-70 transition-opacity hover:opacity-100"
              >
                {showConfirm ? <EyeOff className="size-full" /> : <Eye className="size-full" />}
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              role="checkbox"
              aria-checked={agree}
              aria-label="I agree to the Terms of Service and Privacy Policy"
              onClick={() => setAgree((v) => !v)}
              className={cn(
                "grid size-[18px] shrink-0 place-items-center rounded-[4px] border-2 transition-colors",
                agree ? "border-[#05DF8B] bg-[#05DF8B]" : "border-white bg-transparent"
              )}
            >
              {agree ? <Check className="size-3 text-[#181A1B]" strokeWidth={3} /> : null}
            </button>
            <p className="text-[13px] leading-snug text-white">
              I agree to the{" "}
              <a href="#" className="text-[#69A6D5] underline">Terms of Service</a> and{" "}
              <a href="#" className="text-[#69A6D5] underline">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Primary: Start Your Journey */}
        <button
          type="submit"
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full bg-[#05DF8B] text-[15px] font-bold text-[#181A1B] transition-[filter,transform] hover:brightness-95 active:translate-y-px"
        >
          <Rocket className="size-[18px]" />
          Start Your Journey
        </button>
      </form>
    </div>
  );
}
