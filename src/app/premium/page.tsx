import type { Metadata } from "next";
import { PremiumPlans } from "@/components/premium/premium-plans";

export const metadata: Metadata = {
  title: "Go Premium | HalalWalls",
  description: "Unlock the full potential of HalalWalls — no ads, exclusive wallpapers, and more.",
};

export default function PremiumPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-hw-bg px-4 py-6">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(5,223,139,0.10) 0%, rgba(11,14,17,0) 70%)",
        }}
      />
      <PremiumPlans />
    </main>
  );
}
