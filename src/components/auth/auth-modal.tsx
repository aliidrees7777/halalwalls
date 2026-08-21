"use client";

import { useEffect, useRef, type ComponentType, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuth, type AuthModalView } from "@/context/auth-context";
import { SignInBoxCard } from "./sign-in-box-card";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
import { ForgotPasswordCard } from "./forgot-password-card";
import { PremiumPlans } from "../premium/premium-plans";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileModalBackButton } from "@/components/shared/mobile-modal-back-button";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

/** Mobile: full-screen page with header/footer. Desktop: dimmed glass overlay. */
function MobilePageShell({
  children,
  onBack,
}: {
  children: ReactNode;
  onBack: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white dark:bg-hw-bg md:items-center md:justify-center md:bg-black/20 md:p-4 md:backdrop-blur-[1px] dark:md:bg-black/25">
      <div className="shrink-0 md:hidden">
        <SiteHeader />
      </div>

      <div className="relative flex flex-1 flex-col px-4 py-6 md:flex-none md:items-center md:justify-center md:p-0">
        {/* Same visual spot as before: content area top-left (shell uses px-4 py-6). */}
        <MobileModalBackButton onClick={onBack} className="left-4 top-6" />
        {children}
      </div>

      <div className="shrink-0 pb-[72px] md:hidden md:pb-0">
        <SiteFooter className="!mt-0" />
      </div>
    </div>
  );
}

const VIEW_MAP: Record<AuthModalView, ComponentType> = {
  login: SignInBoxCard,
  signin: SignInBoxCard,
  "full-signin": SignInCard,
  signup: SignUpCard,
  forgot: ForgotPasswordCard,
  premium: PremiumPlans,
};

export function AuthModal() {
  const { authModal, closeAuthModal } = useAuth();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useBodyScrollLock(authModal.open);

  // Close when the user navigates via header/footer links (mobile page shell).
  useEffect(() => {
    if (authModal.open && prevPathname.current !== pathname) {
      closeAuthModal();
    }
    prevPathname.current = pathname;
  }, [pathname, authModal.open, closeAuthModal]);

  if (!authModal.open) return null;

  const View = VIEW_MAP[authModal.view];

  return (
    <MobilePageShell onBack={closeAuthModal}>
      <View />
    </MobilePageShell>
  );
}
