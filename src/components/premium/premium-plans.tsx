import { Gem, Sparkles, Check } from "lucide-react";

/**
 * Go Premium pricing card. Matches the Figma "Subs container" frame:
 * dark-glass container rgba(24,26,27,0.77) + green #05DF8B border, "Go Premium"
 * heading, and three plan cards (Flexible / Popular / Best Value).
 * Card header #1D2021, features panel #323639, green check badges, #1D2021 pill.
 */
const PLANS = [
  { badge: "Flexible", badgeBg: "#323639", badgeText: "#FFFFFF", price: "$2.99", period: "/month" },
  { badge: "Popular", badgeBg: "#D2B100", badgeText: "#1D2021", price: "$9.99", period: "/year" },
  { badge: "Best Value", badgeBg: "#5D00C0", badgeText: "#FFFFFF", price: "$29.99", period: "/lifetime" },
];

const FEATURES = [
  "No Ads",
  "Exclusive Wallpapers",
  "Premium Collections",
  "24/7 Priority Support",
];

export function PremiumPlans() {
  return (
    <div
      className="relative z-10 my-auto flex w-full max-w-[804px] flex-col items-center gap-8 rounded-2xl border-2 border-[#05DF8B] bg-hw-card/90 p-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-md sm:p-10"
    >
      {/* Heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <Gem className="size-9 text-hw-foreground" />
        <h1 className="text-2xl font-semibold text-hw-foreground">Go Premium</h1>
        <p className="text-sm font-light tracking-wide text-hw-muted">
          Unlock the full potential of HalalWalls
        </p>
      </div>

      {/* Plans */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.badge}
            className="flex flex-col overflow-hidden rounded-xl border border-[#05DF8B]"
          >
            {/* Card header */}
            <div className="relative overflow-hidden bg-hw-deep px-4 pb-5 pt-4">
              <Gem className="absolute -right-1 top-1 size-20 rotate-12 text-[#05DF8B]/80" />
              <Sparkles className="absolute right-16 top-2 size-4 text-[#05DF8B]/80" />
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-hw-foreground">Premium</h3>
                <span
                  className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider"
                  style={{ background: plan.badgeBg, color: plan.badgeText }}
                >
                  {plan.badge}
                </span>
              </div>
            </div>

            {/* Features panel */}
            <div className="flex flex-1 flex-col gap-5 rounded-xl bg-hw-surface p-4">
              <p className="text-[26px] leading-none text-hw-foreground">
                {plan.price}
                <span className="text-base text-hw-muted">{plan.period}</span>
              </p>

              <ul className="flex flex-col gap-2.5">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs font-light text-hw-foreground">
                    <span className="grid size-[15px] shrink-0 place-items-center rounded-[3px] bg-[#05DF8B]">
                      <Check className="size-2.5 text-black" strokeWidth={3.5} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="mt-auto rounded-full bg-hw-pill2 py-2.5 text-center text-sm font-medium text-hw-foreground transition-colors hover:bg-hw-pill2-hover active:translate-y-px"
              >
                Get Started
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-hw-faint">
        Demo — checkout is not connected yet.
      </p>
    </div>
  );
}
