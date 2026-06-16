"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

/**
 * Global sign-in / sign-up modal.
 * Animated to slide up from the bottom on mobile.
 */
export function AuthModal() {
  const { authModal, openAuthModal, closeAuthModal, login, signup } = useAuth();
  const isSignup = authModal.view === "signup";

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authModal.open) {
      setError(null);
      setPassword("");
      setConfirmPassword("");
    }
  }, [authModal.open, authModal.view]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isSignup) {
        await signup({ firstName, email, password, confirmPassword });
      } else {
        await login(email, password);
      }
      closeAuthModal();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBox =
    "flex h-10 items-center rounded-lg border border-hw-input-border bg-hw-input px-3 transition-colors focus-within:border-hw-green";
  const input =
    "w-full bg-transparent text-sm text-hw-foreground outline-none placeholder:text-hw-faint/50";

  return (
    <AnimatePresence>
      {authModal.open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* scrim */}
          <button
            type="button"
            aria-label="Close"
            onClick={closeAuthModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative z-10 w-full max-w-[400px] rounded-2xl border-2 border-hw-green bg-hw-card p-6 shadow-xl sm:p-7"
          >
            <button
              type="button"
              onClick={closeAuthModal}
              aria-label="Close"
              className="absolute right-4 top-4 grid size-7 place-items-center rounded-full text-hw-faint transition-colors hover:bg-hw-pill2 hover:text-hw-foreground"
            >
              <X className="size-4" />
            </button>

            <h2 className="text-center text-[22px] font-bold leading-tight text-hw-foreground">
              {isSignup ? "Create your account" : "Sign In"}
            </h2>
            <p className="mt-1 text-center text-[13px] text-hw-muted">
              {isSignup ? "Sign up to download & save wallpapers." : "Sign in to download & favorite."}
            </p>

            <form className="mt-5 flex flex-col gap-3.5" onSubmit={onSubmit}>
              {error && (
                <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-[13px] text-red-400">
                  {error}
                </p>
              )}

              {isSignup && (
                <div className={inputBox}>
                  <input
                    className={input}
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className={inputBox}>
                <input
                  className={input}
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={inputBox}>
                <input
                  className={input}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {isSignup && (
                <div className={inputBox}>
                  <input
                    className={input}
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 flex h-10 w-full items-center justify-center rounded-full bg-hw-green text-[15px] font-bold text-black transition-[filter,transform] hover:brightness-95 active:translate-y-px disabled:opacity-60"
              >
                {submitting ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
              </button>
            </form>

            <p className="mt-4 text-center text-[13px] text-hw-muted">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => openAuthModal(isSignup ? "signin" : "signup")}
                className={cn("font-semibold text-hw-green underline-offset-2 hover:underline")}
              >
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}