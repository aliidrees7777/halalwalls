"use client";
import { Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import dimond from "../../../public/authicon/dimond.svg";
import start from "../../../public/authicon/start.svg";
import whitedimond from "../../../public/authicon/whitedimond.svg";
import close from "../../../public/authicon/close.svg";
import { useAuth } from "@/context/auth-context";
import { api, ApiError } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

// Three plans: monthly + yearly recur, lifetime is a one-time payment.
const PLANS = [
  { key: "monthly", badge: "Flexible", badgeBg: "#323639", badgeText: "#FFFFFF", price: "$2.99", period: "/month" },
  { key: "yearly", badge: "Popular", badgeBg: "#D2B100", badgeText: "#1D2021", price: "$9.99", period: "/year" },
  { key: "lifetime", badge: "Best Value", badgeBg: "#5D00C0", badgeText: "#FFFFFF", price: "$29.99", period: "/lifetime" },
];

const FEATURES = [
  "No Ads",
  "Exclusive Wallpapers",
  "Premium Collections",
  "24/7 Priority Support",
];

export function PremiumPlans() {
  const { isAuthenticated, openAuthModal, closeAuthModal, refreshMe, user } =
    useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );
  // The signed-in user's active plan — drives "Activated" vs "Upgrade" labels.
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  // True until we've resolved the current plan for a premium user — prevents the
  // brief "all cards say Upgrade" flash before /subscriptions/me responds.
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentPlan(null);
      setPlanLoading(false);
      return;
    }
    let ignore = false;
    setPlanLoading(true);
    api
      .get<{ isPremium: boolean; plan: string | null }>("/subscriptions/me")
      .then((d) => {
        if (!ignore) setCurrentPlan(d.isPremium ? d.plan : null);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setPlanLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, user?.isPremium]);

  // Handle the return from Stripe Checkout (success_url / cancel_url).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success") {
      const sessionId = params.get("session_id");
      (async () => {
        try {
          if (sessionId) await api.post("/subscriptions/confirm", { sessionId });
          await refreshMe();
          try {
            const s = await api.get<{ isPremium: boolean; plan: string | null }>(
              "/subscriptions/me",
            );
            setCurrentPlan(s.isPremium ? s.plan : null);
          } catch {}
          setMessage({ kind: "ok", text: "🎉 You're Premium! Your plan is active." });
        } catch {
          setMessage({ kind: "ok", text: "Payment received — your premium will activate shortly." });
        }
      })();
    } else if (status === "cancelled") {
      setMessage({ kind: "err", text: "Checkout cancelled. You can subscribe anytime." });
    }
  }, [refreshMe]);

  async function handleSubscribe(planKey: string) {
    setMessage(null);
    if (!isAuthenticated) {
      openAuthModal("signin");
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
      setMessage({
        kind: "err",
        text: err instanceof ApiError ? err.message : "Couldn't start checkout. Please try again.",
      });
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
        className="relative z-10 my-auto flex w-full max-w-[1275px] max-h-[95dvh] overflow-y-auto flex-col items-center gap-6 sm:gap-10 rounded-2xl border-3 border-[#05DF8B] p-4 sm:p-10 bg-hw-card/80"
      >
        {/* Close */}
        <button
          onClick={closeAuthModal}
          className="absolute top-3 right-4 sm:top-4 sm:right-6 text-2xl font-bold text-hw-depw hover:text-white transition-colors cursor-pointer"
        >
          <Image src={close} alt="Close" width={20} height={20} />
        </button>

        {/* Heading */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 text-center px-6 primary-font">
          <Image src={whitedimond} alt="" className="size-12 sm:size-16 text-hw-foreground" />
          <h1 className="text-[26px] sm:text-[41px] font-semibold text-hw-depw primary-font">
            Go Premium
          </h1>
          <p className="text-[15px] sm:text-[22px] font-light tracking-wide text-hw-depw primary-font">
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
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 primary-font">
          {PLANS.map((plan) => {
            // While a premium user's plan is still loading, don't guess — show a
            // neutral loading state instead of flashing every card as "Upgrade".
            const resolving = !!user?.isPremium && planLoading;
            const isCurrent =
              !resolving && !!user?.isPremium && currentPlan === plan.key;
            const lifetimeOwned =
              !resolving && !!user?.isPremium && currentPlan === "lifetime";
            // Non-current plans can be upgraded to — unless lifetime is owned.
            const upgradable =
              !resolving && !!user?.isPremium && !isCurrent && !lifetimeOwned;
            const actionable = !resolving && (!user?.isPremium || upgradable);
            return (
            <div
              key={plan.key}
              className={
                "flex flex-col overflow-hidden rounded-xl border border-[#05DF8B]" +
                (isCurrent
                  ? " ring-2 ring-[#05DF8B] ring-offset-2 ring-offset-hw-card"
                  : "")
              }
            >
              {/* Card header */}
              <div className="relative overflow-hidden bg-hw-deep px-4 pb-5 pt-4 h-[158px]">
                <Image src={dimond} alt="" className="absolute right-6 top-9 rotate-12 text-[#05DF8B]/80" width={170} />
                <Image src={start} alt="" className="absolute right-7 top-7 size-7 text-[#05DF8B]/80" />
                <Image src={start} alt="" className="absolute right-28 top-2 size-4 text-[#05DF8B]/80" />
                <div className="relative z-10">
                  <h3 className="text-[20px] sm:text-[28px] font-semibold text-hw-depw primary-font">
                    Premium
                  </h3>
                  <span
                    className="mt-2 inline-block rounded-full px-2 py-0.5 text-[14px] font-medium tracking-wider"
                    style={{ background: plan.badgeBg, color: plan.badgeText }}
                  >
                    {plan.badge}
                  </span>
                </div>
              </div>

              {/* Features panel */}
              <div className="flex flex-1 flex-col gap-4 sm:gap-6 rounded-[20px] bg-[#323639] px-4 py-6 w-full">
                <p className="text-[28px] sm:text-[41px] leading-none text-hw-depw primary-font">
                  {plan.price}
                  <span className="text-[18px] sm:text-[28px] text-hw-depw primary-font">
                    {plan.period}
                  </span>
                </p>

                <ul className="flex flex-col gap-2.5">
                  {FEATURES.map((f) => (
                    <li key={f} className="primary-font flex items-center gap-2 text-[15px] sm:text-[19px] font-light text-hw-depw">
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
                  disabled={loadingPlan !== null || !actionable}
                  className={
                    "primary-font mt-auto flex items-center justify-center gap-1.5 rounded-full py-2.5 text-center text-[16px] sm:text-[22px] font-medium transition-colors active:translate-y-px disabled:cursor-not-allowed " +
                    (isCurrent
                      ? "bg-[#05DF8B] text-hw-input disabled:opacity-100"
                      : "bg-hw-bg text-hw-depw hover:bg-hw-pill2-hover disabled:opacity-60")
                  }
                >
                  {isCurrent && !loadingPlan && (
                    <Check className="size-4" strokeWidth={3} />
                  )}
                  {resolving ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-hw-depw/40 border-t-hw-depw" />
                  ) : null}
                  {loadingPlan === plan.key
                    ? "Redirecting…"
                    : resolving
                      ? "Loading…"
                      : isCurrent
                        ? "Activated"
                        : !user?.isPremium
                          ? "Get Started"
                          : upgradable
                            ? "Upgrade"
                            : "Included"}
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
