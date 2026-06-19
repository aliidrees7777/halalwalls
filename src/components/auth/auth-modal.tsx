"use client";
import { useAuth } from "@/context/auth-context";
import { SignInBoxCard } from "./sign-in-box-card";
import {SignInCard} from "./sign-in-card"
import {SignUpCard} from "./sign-up-card"
import {ForgotPasswordCard} from "./forgot-password-card"
import {PremiumPlans} from "../premium/premium-plans"
export function AuthModal() {
  const { authModal,} = useAuth();

  if (!authModal.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40  p-4">
      
        {authModal.view === "signin" && <SignInBoxCard />}
        {authModal.view === "full-signin" && <SignInCard />}
        {authModal.view === "signup" && <SignUpCard />}
        {authModal.view === "forgot" && <ForgotPasswordCard />}
        {authModal.view === "premium" && <PremiumPlans />}
    </div>
  );
}
