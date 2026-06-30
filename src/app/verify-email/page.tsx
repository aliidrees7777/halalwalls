import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailCard } from "@/components/auth/verify-email-card";

export const metadata: Metadata = {
  title: "Verify Email — HalalWalls",
};

export default function VerifyEmailPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-hw-bg px-4 py-6">
      {/* subtle backdrop glow (fixed so it never affects layout/overflow) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(5,223,139,0.10) 0%, rgba(11,14,17,0) 70%)",
        }}
      />
      <Suspense fallback={null}>
        <VerifyEmailCard />
      </Suspense>
    </main>
  );
}
