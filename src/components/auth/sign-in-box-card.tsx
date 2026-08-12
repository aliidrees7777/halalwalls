"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { ModalCloseIcon } from "@/components/auth/modal-close-icon";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import badgecheck from "../../../public/authicon/badgecheck.svg";

const FEATURES = [
  "Save Favorites",
  "Sync Across Devices",
  "Personalized Suggestions",
  "View History",
  "Easy Downloads",
  "Upload Wallpapers",
];

export function SignInBoxCard({ standalone = false }: { standalone?: boolean }) {
  const router = useRouter();
  const { authModal, openAuthModal, closeAuthModal } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function showLoginError(message: string) {
    setError(message);
    toast({ type: "error", message });
  }

  return (
    <AnimatePresence>
      {(standalone || authModal.open) && (
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
          className="relative z-10 my-auto flex h-auto w-full max-w-[825px] flex-col items-center justify-center rounded-none border-0 bg-transparent p-0 shadow-none dark:bg-transparent md:rounded-2xl md:border-2 md:border-[#05DF8B] md:bg-[#EEEEEE] md:p-6 md:shadow-[0_8px_24px_rgba(0,0,0,0.25)] dark:md:bg-hw-card/80 sm:md:p-7"
        >
          <button
            onClick={() => {
              closeAuthModal();
              if (standalone) router.push("/");
            }}
            className={
              standalone
                ? "absolute top-4 right-6 cursor-pointer text-2xl font-bold text-hw-depw transition-colors hover:text-white"
                : "absolute top-4 right-6 hidden cursor-pointer text-2xl font-bold text-hw-depw transition-colors hover:text-white md:block"
            }
          >
            <ModalCloseIcon />
          </button>
          <div className="flex w-full max-w-xl flex-col gap-8">
            <h1 className="text-center text-[31px] font-bold leading-tight text-hw-depw">
              Sign in
            </h1>
            <div className="rounded-2xl border border-[#05DF8B] bg-hw-header p-10 ">
              <h2 className="text-[20px] font-semibold text-hw-depw">
                Start Your Journey With HalalWalls
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {FEATURES.map((label) => (
                  <li key={label} className="flex items-center gap-2.5">
                    <Image
                      src={badgecheck}
                      alt="Close"
                      width={25}
                      height={25}
                    />
                    <span className="lg:text-[20px] font-light text-hw-depw">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-400"
              >
                {error}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <GoogleSignInButton
                onSuccess={(user) => {
                  closeAuthModal();
                  toast({
                    type: "success",
                    message: user.firstName
                      ? `Welcome back, ${user.firstName}!`
                      : "Signed in with Google.",
                  });
                  router.push("/");
                }}
                onError={showLoginError}
              >
                <span className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#05DF8B] text-[22px] font-bold text-black transition-[filter,transform] group-hover:brightness-95 dark:text-hw-input">
                  <span className="grid size-7 place-items-center rounded-full bg-white">
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
                </span>
              </GoogleSignInButton>
              <button
                type="button"
                onClick={() => openAuthModal("full-signin")}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#212121] text-sm font-semibold text-white transition-colors hover:bg-[#2a2a2a] active:translate-y-px dark:bg-hw-input dark:text-hw-faint dark:hover:bg-hw-pill2-hover"
              >
                <CornerDownRight className="size-[15px]" />
                Continue with Email
              </button>
              <span className="text-center text-[15px] font-semibold text-[#555555] dark:text-hw-foreground dark:opacity-70">
                or
              </span>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="flex h-11 w-full items-center justify-center rounded-full bg-[#455A64] text-sm font-semibold text-white transition-colors hover:bg-[#3e5159] active:translate-y-px dark:bg-hw-pill2 dark:text-hw-foreground dark:hover:bg-hw-pill2-hover"
              >
                Create an account
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
