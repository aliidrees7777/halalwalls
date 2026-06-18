"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import close from "../../../public/authicon/close.svg";
import { useAuth } from "@/context/auth-context";
export function ForgotPasswordCard() {
  const { signup,closeAuthModal,openAuthModal } = useAuth();
  const router = useRouter();
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
      className="relative z-10 my-auto flex justify-center items-center w-full max-w-[825px] h-[480px] rounded-2xl border-2 border-[#05DF8B] bg-hw-card/80 sm:p-7"
    >
     <button
        onClick={closeAuthModal}
        className="absolute top-4 right-6 text-2xl font-bold text-hw-depw hover:text-white transition-colors cursor-pointer"
      >
        <Image src={close} alt="Close" width={20} height={20} />
      </button>
      <form
        className="flex flex-col gap-12 w-xl"
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
          <h1 className="text-center text-[31px] font-bold leading-tight text-hw-depw">
            Forgot Password?
          </h1>
          <p className="mx-auto max-w-[350px] text-center text-[15px] leading-relaxed text-hw-faint">
            If you forgot your password, please enter your email below and we will
            send you a recovery link.
          </p>
        </div>

        {/* Email field */}
        <div className="space-y-1.5">
          <label htmlFor="forgot-email" className="block text-[31px] font-semibold text-hw-depw">
            Email Address
          </label>
          <div className="flex h-12 items-center rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-[#05DF8B]">
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-transparent text-[19px] text-hw-foreground outline-none placeholder:text-hw-faint/50"
            />
          </div>
        </div>

        {/* Primary: Send Recovery Link */}
        <button
          type="submit"
          disabled={submitting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#05DF8B] text-[21px] font-bold text-hw-input transition-[filter,transform] hover:brightness-95 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Please wait…" : "Send Recovery Link"}
          {!submitting && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
              <path d="M3 11l18-8-8 18-2.5-7.5L3 11z" />
            </svg>
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-[13px] text-hw-faint font-[450px]">
          Remember your password?{" "}
          <button 
          type="button"
          onClick={()=>openAuthModal("full-signin")}
          className="text-[#69A6D5] underline">
            Log in
          </button>
        </p>
      </form>
    </motion.div>
    </AnimatePresence>
  );
}
