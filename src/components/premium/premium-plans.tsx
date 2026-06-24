"use client";
import { Gem, Sparkles, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dimond from "../../../public/authicon/dimond.svg";
import start from "../../../public/authicon/start.svg";
import whitedimond from "../../../public/authicon/whitedimond.svg";
import close from "../../../public/authicon/close.svg";
import { useAuth } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
const PLANS = [
  {
    badge: "Flexible",
    badgeBg: "#323639",
    badgeText: "#FFFFFF",
    price: "$2.99",
    period: "/month",
  },
  {
    badge: "Popular",
    badgeBg: "#D2B100",
    badgeText: "#1D2021",
    price: "$9.99",
    period: "/year",
  },
  {
    badge: "Best Value",
    badgeBg: "#5D00C0",
    badgeText: "#FFFFFF",
    price: "$29.99",
    period: "/lifetime",
  },
];

const FEATURES = [
  "No Ads",
  "Exclusive Wallpapers",
  "Premium Collections",
  "24/7 Priority Support",
];

export function PremiumPlans() {
  const { signup, closeAuthModal } = useAuth();
  const router = useRouter();
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
        className="relative z-10 my-auto flex w-full max-w-[1275px] h-auto sm:h-[900px] max-h-[95dvh] sm:max-h-none overflow-y-auto sm:overflow-visible flex-col items-center gap-6 sm:gap-20 rounded-2xl border-3 border-[#05DF8B] p-4 sm:p-10 bg-hw-card/80"
      >
        {/* Heading */}
        <button
          onClick={closeAuthModal}
          className="absolute top-3 right-4 sm:top-4 sm:right-6 text-2xl font-bold text-hw-depw hover:text-white transition-colors cursor-pointer"
        >
          <Image src={close} alt="Close" width={20} height={20} />
        </button>
        <div className="flex flex-col items-center gap-2 sm:gap-3 text-center px-6 primary-font">
          <Image
            src={whitedimond}
            alt="whitedimond"
            className="size-12 sm:size-16 text-hw-foreground"
          />
          <h1 className="text-[26px] sm:text-[41px] font-semibold text-hw-depw primary-font">
            Go Premium
          </h1>
          <p className="text-[15px] sm:text-[22px] font-light tracking-wide text-hw-depw primary-font">
            Unlock the full potential of HalalWalls
          </p>
        </div>

        {/* Plans */}
        <div className="grid w-full h-auto sm:h-[490px] grid-cols-1 gap-4 sm:grid-cols-3 primary-font">
          {PLANS.map((plan) => (
            <div
              key={plan.badge}
              className="flex flex-col overflow-hidden rounded-xl border border-[#05DF8B]"
            >
              {/* Card header */}
              <div className="relative overflow-hidden bg-hw-deep px-4 pb-5 pt-4 h-[158px]">
                <Image
                  src={dimond}
                  alt="dimond"
                  className="absolute right-6 top-9  rotate-12 text-[#05DF8B]/80"
                  width={170}
                />
                <Image
                  src={start}
                  alt="start"
                  className="absolute right-7 top-7 size-7 text-[#05DF8B]/80"
                />
                <Image
                  src={start}
                  alt="start"
                  className="absolute right-28 top-2 size-4 text-[#05DF8B]/80"
                />

                <Image
                  src={start}
                  alt="start"
                  className="absolute right-50 top-25 size-5 text-[#05DF8B]/80"
                />
                {/* <Sparkles className="absolute right-16 top-2 size-4 text-[#05DF8B]/80" /> */}
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
              <div className="flex flex-1 flex-col gap-4 sm:gap-8 rounded-[20px] bg-[#323639] px-4 py-6 w-full sm:absolute sm:top-110 sm:w-[384px]">
                <p className="text-[28px] sm:text-[41px] leading-none text-hw-depw primary-font">
                  {plan.price}
                  <span className="text-[18px] sm:text-[28px] text-hw-depw primary-font">
                    {plan.period}
                  </span>
                </p>

                <ul className="flex flex-col gap-2.5">
                  {FEATURES.map((f) => (
                    <li
                      key={f}
                      className="primary-font flex items-center gap-2 text-[15px] sm:text-[19px] font-light text-hw-depw"
                    >
                      <span className="grid size-[23px] shrink-0 place-items-center rounded-full bg-[#05DF8B]">
                        <Check
                          className="size-3 text-black"
                          strokeWidth={3.5}
                        />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="primary-font mt-auto rounded-full bg-hw-bg py-2.5 text-center text-[16px] sm:text-[22px] font-medium text-hw-depw transition-colors hover:bg-hw-pill2-hover active:translate-y-px"
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
