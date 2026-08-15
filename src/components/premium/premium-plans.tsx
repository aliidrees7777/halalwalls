"use client";
import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import dimond from "../../../public/authicon/dimond.svg";
import start from "../../../public/authicon/start.svg";
import { ModalCloseIcon } from "@/components/auth/modal-close-icon";
import { useAuth } from "@/context/auth-context";
import { api, ApiError } from "@/lib/api";
import { hasPremiumAccess } from "@/lib/premium-access";
import { useToast } from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";

// Three plans: monthly + yearly recur, lifetime is a one-time payment.
const PLANS = [
  { key: "monthly", badge: "Flexible", badgeBg: "#323639", badgeText: "#FFFFFF", badgeWeight: 300, price: "$2.99", period: "/month" },
  { key: "yearly", badge: "Popular", badgeBg: "#D2B100", badgeText: "#1D2021", badgeWeight: 500, price: "$9.99", period: "/year" },
  { key: "lifetime", badge: "Best Value", badgeBg: "#5D00C0", badgeText: "#FFFFFF", badgeWeight: 300, price: "$29.99", period: "/lifetime" },
];

const FEATURES = [
  "No Ads",
  "Exclusive Wallpapers",
  "Premium Collections",
  "24/7 Priority Support",
];

type PlanKey = (typeof PLANS)[number]["key"];

function getPlanButton(planKey: PlanKey, isPremium: boolean, currentPlan?: string | null) {
  if (!isPremium) {
    return { label: "Get Started", disabled: false };
  }
  if (currentPlan === planKey) {
    return { label: "Current plan", disabled: true };
  }
  if (currentPlan === "lifetime") {
    return { label: "Included", disabled: true };
  }
  // No downgrade path in checkout — only upgrades to higher tiers.
  if (
    (currentPlan === "yearly" && planKey === "monthly") ||
    (currentPlan === "lifetime" && planKey !== "lifetime")
  ) {
    return { label: "—", disabled: true };
  }
  return { label: "Upgrade", disabled: false };
}

export function PremiumPlans() {
  const router = useRouter();
  const pathname = usePathname();
  const isStandalonePage = pathname === "/premium";
  const { isAuthenticated, openAuthModal, closeAuthModal, user } = useAuth();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  async function handleSubscribe(planKey: string) {
    setMessage(null);
    if (!isAuthenticated) {
      openAuthModal("signin");
      return;
    }
    if (hasPremiumAccess(user) && user?.subscriptionPlan === planKey) {
      setMessage({ kind: "ok", text: "You're already on this plan." });
      return;
    }
    if (hasPremiumAccess(user) && user?.subscriptionPlan === "lifetime") {
      setMessage({ kind: "ok", text: "You already have lifetime premium." });
      return;
    }
    setLoadingPlan(planKey);
    try {
      const { url } = await api.post<{ url: string }>("/subscriptions/checkout", {
        plan: planKey,
      });
      if (url) window.location.href = url;
      else throw new Error("No checkout URL");
    } catch (err) {
      const text =
        err instanceof ApiError ? err.message : "Couldn't start checkout. Please try again.";
      setMessage({ kind: "err", text });
      toast({ type: "error", message: text });
      setLoadingPlan(null);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={
          isStandalonePage
            ? "relative z-10 my-auto flex h-auto max-h-[95dvh] w-full max-w-[1275px] flex-col items-center gap-6 overflow-y-auto rounded-2xl border-3 border-[#05DF8B] bg-[#EEEEEE] p-4 shadow-[0_0_60px_rgba(0,255,163,0.12)] dark:bg-[rgba(24,26,27,0.72)] dark:backdrop-blur-xl md:box-border md:h-[897.86px] md:w-[1275px] md:max-h-[897.86px] md:justify-center md:gap-[79.29px] md:rounded-[31.716px] md:border-[3.172px] md:p-[95.149px] md:shadow-[0px_6.343px_6.343px_rgba(0,0,0,0.25)]"
            : "relative z-10 my-auto flex h-auto max-h-[95dvh] w-full max-w-[1275px] flex-col items-center gap-6 overflow-y-auto rounded-2xl border-3 border-[#05DF8B] bg-[#EEEEEE] p-4 shadow-[0_0_60px_rgba(0,255,163,0.12)] dark:bg-[rgba(24,26,27,0.72)] dark:backdrop-blur-xl md:box-border md:h-[897.86px] md:w-[1275px] md:max-h-[897.86px] md:justify-center md:gap-[79.29px] md:rounded-[31.716px] md:border-[3.172px] md:p-[95.149px] md:shadow-[0px_6.343px_6.343px_rgba(0,0,0,0.25)] max-md:max-h-none max-md:overflow-y-visible max-md:rounded-none max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-none max-md:dark:bg-transparent"
        }
      >
        {/* Close — desktop modal / standalone page only; mobile uses header nav */}
        <button
          onClick={() => {
            if (isStandalonePage) router.push("/");
            else closeAuthModal();
          }}
          className={
            isStandalonePage
              ? "absolute top-3 right-4 cursor-pointer text-2xl font-bold text-hw-depw transition-colors hover:opacity-70 sm:top-4 sm:right-6 dark:text-white"
              : "absolute top-3 right-4 hidden cursor-pointer text-2xl font-bold text-hw-depw transition-colors hover:opacity-70 sm:top-4 sm:right-6 md:block dark:text-white"
          }
        >
          <ModalCloseIcon />
        </button>

        {/* Heading */}
        <div className="primary-font flex flex-col items-center gap-2 px-6 text-center sm:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/premium-icon-modal-lightmode.svg"
            alt=""
            className="size-12 sm:size-16 dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/premium-icon-modal-darkmode.svg"
            alt=""
            className="hidden size-12 sm:size-16 dark:block"
          />
          <h1 className="primary-font text-[26px] font-semibold text-black sm:text-[41px] dark:text-hw-depw">
            Go Premium
          </h1>
          <p className="primary-font text-[15px] font-light tracking-wide text-black sm:text-[22px] dark:text-hw-depw">
            Unlock the full potential of HalalWalls
          </p>
        </div>

        {/* Status message */}
        {message && (
          <p
            role={message.kind === "err" ? "alert" : "status"}
            className={
              "w-full max-w-[420px] rounded-lg border px-3 py-2 text-center text-sm " +
              (message.kind === "ok"
                ? "border-[#05DF8B]/40 bg-[#05DF8B]/10 text-[#05DF8B]"
                : "border-red-500/40 bg-red-500/10 text-red-400")
            }
          >
            {message.text}
          </p>
        )}

        {/* Plans */}
        <div className="primary-font grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className="flex flex-col overflow-hidden rounded-xl border border-[#05DF8B]"
            >
              <div className="relative z-0 h-[158px] overflow-hidden bg-white px-4 pt-4 pb-5 dark:bg-[#181c1d]">
                <Image
                  src={dimond}
                  alt=""
                  className="absolute top-9 right-6 rotate-12 text-[#05DF8B]/80"
                  width={170}
                />
                <Image
                  src={start}
                  alt=""
                  className="absolute top-7 right-7 size-7 text-[#05DF8B]/80"
                />
                <Image
                  src={start}
                  alt=""
                  className="absolute top-2 right-28 size-4 text-[#05DF8B]/80"
                />
                <div className="relative z-10">
                  <h3 className="primary-font text-[20px] font-semibold text-black sm:text-[28px] dark:text-hw-depw">
                    Premium
                  </h3>
                  <span
                    className="mt-2 inline-block rounded-full px-2 py-0.5 text-[14px] tracking-wider"
                    style={{
                      background: plan.badgeBg,
                      color: plan.badgeText,
                      fontWeight: plan.badgeWeight,
                    }}
                  >
                    {plan.badge}
                  </span>
                </div>
              </div>

              <div className="relative z-10 -mt-5 flex w-full flex-1 flex-col gap-4 rounded-t-[20px] bg-[#323639] px-4 py-6 sm:gap-6">
                <p className="primary-font text-[28px] leading-none text-white sm:text-[41px]">
                  {plan.price}
                  <span className="primary-font text-[18px] text-white sm:text-[28px]">
                    {plan.period}
                  </span>
                </p>

                <ul className="flex flex-col gap-2.5">
                  {FEATURES.map((f) => (
                    <li
                      key={f}
                      className="primary-font flex items-center gap-2 text-[15px] font-light text-white sm:text-[19px]"
                    >
                      <span className="grid size-[23px] shrink-0 place-items-center rounded-full bg-[#05DF8B]">
                        <Check className="size-3 text-black" strokeWidth={3.5} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={
                    loadingPlan !== null ||
                    getPlanButton(
                      plan.key,
                      hasPremiumAccess(user),
                      user?.subscriptionPlan,
                    ).disabled
                  }
                  className="primary-font mt-auto rounded-full bg-white py-2.5 text-center text-[16px] font-medium text-black transition-colors hover:bg-neutral-100 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 sm:text-[22px] dark:bg-[#1d2021] dark:text-hw-depw dark:hover:bg-[#2a2e2f]"
                >
                  {loadingPlan === plan.key
                    ? "Redirecting…"
                    : getPlanButton(
                        plan.key,
                        hasPremiumAccess(user),
                        user?.subscriptionPlan,
                      ).label}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
