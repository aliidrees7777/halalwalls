"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { api } from "@/lib/api";

/**
 * Confirms a Stripe Checkout return (`?status=success&session_id=…`).
 * Subscription is sold via the auth modal — on success we refresh the session,
 * toast, close the modal, and land on home with a clean URL.
 */
export function StripeCheckoutReturn() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { refreshMe, closeAuthModal } = useAuth();
  const { toast } = useToast();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const status = searchParams.get("status");
    if (status !== "success" && status !== "cancelled") return;

    handled.current = true;
    closeAuthModal();

    if (status === "cancelled") {
      toast({ type: "info", message: "Checkout cancelled. You can subscribe anytime." });
      router.replace("/");
      return;
    }

    const sessionId = searchParams.get("session_id");
    (async () => {
      try {
        if (sessionId) await api.post("/subscriptions/confirm", { sessionId });
        await refreshMe();
        toast({
          type: "success",
          message: "You're Premium! Your subscription is active.",
        });
      } catch {
        toast({
          type: "success",
          message: "Payment received — your premium will activate shortly.",
        });
      }
      router.replace("/");
    })();
  }, [closeAuthModal, pathname, refreshMe, router, searchParams, toast]);

  return null;
}
