import type { Metadata } from "next";
import { ForgotPasswordCard } from "@/components/auth/forgot-password-card";

export const metadata: Metadata = {
  title: "Forgot Password | HalalWalls",
};

export default function ForgotPasswordPage() {
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
      <ForgotPasswordCard />
    </main>
  );
}
