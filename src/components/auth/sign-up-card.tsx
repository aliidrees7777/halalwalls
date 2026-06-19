"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Rocket, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { ApiError } from "@/lib/api";
import close from "../../../public/authicon/close.svg";
import Image from "next/image";

export function SignUpCard() {
  const router = useRouter();
  const { signup,closeAuthModal } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!agree) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const trimmed = fullName.trim();
    const spaceIndex = trimmed.indexOf(" ");
    const firstName = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex);
    const lastName = spaceIndex === -1 ? "" : trimmed.slice(spaceIndex + 1).trim();

    setSubmitting(true);
    try {
      await signup({ firstName, lastName, email, password, confirmPassword });
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
    <motion.div
          key="modal"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
      className="relative z-10 my-auto flex justify-center items-center w-full max-w-[825px] h-[670px] rounded-2xl border-2 border-[#05DF8B] bg-hw-card/80 p-6 sm:p-7"
    >
        <button
        onClick={closeAuthModal}
        className="absolute top-4 right-6 text-2xl font-bold text-hw-depw hover:text-white transition-colors cursor-pointer"
      >
        <Image src={close} alt="Close" width={20} height={20} />
      </button>
      <form
        className="flex flex-col gap-12 w-[570px]"
        onSubmit={handleSubmit}
      >
        {/* Title */}
        <h1 className="text-center text-[31px] font-bold leading-tight text-hw-depw">
          Join Us in a Snap
        </h1>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-400"
          >
            {error}
          </p>
        )}

        {/* Fields */}
        <div className="flex flex-col gap-3.5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="signup-name" className="block text-[19px] font-semibold text-hw-depw">
              Full Name
            </label>
            <div className="flex h-11 items-center rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-[#05DF8B]">
              <input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent text-[19px] text-hw-foreground outline-none placeholder:text-hw-faint/50"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="signup-email" className="block text-[19px] font-semibold text-hw-depw">
              Email Address
            </label>
            <div className="flex h-11 items-center rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-[#05DF8B]">
              <input
                id="signup-email"
                type="email"
                placeholder="example@site.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-[19px] text-hw-foreground outline-none placeholder:text-hw-faint/50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="signup-password" className="block text-[19px] font-semibold text-hw-depw">
              Password
            </label>
            <div className="flex h-11 items-center gap-2 rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-[#05DF8B]">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-[19px] text-hw-foreground outline-none placeholder:text-hw-faint/50"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="grid size-5 shrink-0 place-items-center text-hw-faint opacity-70 transition-opacity hover:opacity-100"
              >
                {showPassword ? <EyeOff className="size-full" /> : <Eye className="size-full" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="signup-confirm" className="block text-[19px] font-semibold text-hw-foreground">
              Confirm Password
            </label>
            <div className="flex h-11 items-center gap-2 rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-[#05DF8B]">
              <input
                id="signup-confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent text-[19px] text-hw-foreground outline-none placeholder:text-hw-faint/50"
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((s) => !s)}
                className="grid size-5 shrink-0 place-items-center text-hw-faint opacity-70 transition-opacity hover:opacity-100"
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
                agree ? "border-[#05DF8B] bg-[#05DF8B]" : "border-hw-foreground bg-transparent"
              )}
            >
              {agree ? <Check className="size-2 text-hw-input" strokeWidth={5} /> : null}
            </button>
            <p className="text-[15px] leading-snug font-[450px]  text-hw-depw">
              I agree to the{" "}
              <a href="/terms" className="text-[#69A6D5] underline">Terms of Service</a> and{" "}
              <a href="/privacy" className="text-[#69A6D5] underline">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Primary: Start Your Journey */}
        <button
          type="submit"
          disabled={submitting}
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full bg-[#05DF8B] text-[22px] font-bold text-hw-input transition-[filter,transform] hover:brightness-95 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Rocket className="size-[22px]" />
          {submitting ? "Please wait…" : "Start Your Journey"}
        </button>
      </form>
    </motion.div>
    </AnimatePresence>
  );
}
