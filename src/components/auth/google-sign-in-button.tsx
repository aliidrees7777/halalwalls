"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";

/**
 * Google sign-in that keeps the original styled (design) button.
 *
 * Google Identity Services only hands back an ID-token `credential` from its own
 * rendered button — a custom button can't trigger that flow directly. So we keep
 * the design button visible (`children`) and overlay Google's real button on top
 * at opacity 0: the user sees our design, the click lands on Google's button, and
 * we get a genuine credential. No placeholder, no backend change.
 */
const GIS_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type GoogleId = {
  initialize: (config: {
    client_id: string;
    callback: (res: { credential?: string }) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleId } };
  }
}

function loadGis(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.google?.accounts?.id) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GIS_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("gis")));
      return;
    }
    const s = document.createElement("script");
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("gis"));
    document.head.appendChild(s);
  });
}

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  /** The original, styled (design) button to display. */
  children: React.ReactNode;
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  children,
}: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const handleCredential = useCallback(
    async (res: { credential?: string }) => {
      if (!res.credential) {
        onError?.("No Google credential received.");
        return;
      }
      try {
        await loginWithGoogle(res.credential);
        onSuccess?.();
      } catch (err) {
        onError?.(
          err instanceof ApiError
            ? err.message
            : "Google sign-in failed. Please try again.",
        );
      }
    },
    [loginWithGoogle, onSuccess, onError],
  );

  // Track the design button's width so the overlaid Google button matches it
  // (GIS caps button width at 400px).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(Math.min(400, Math.round(el.offsetWidth)) || 0);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!CLIENT_ID) {
      onError?.("Google sign-in is not configured.");
      return;
    }
    if (!width) return;
    let cancelled = false;
    loadGis()
      .then(() => {
        const id = window.google?.accounts?.id;
        if (cancelled || !btnRef.current || !id) return;
        id.initialize({ client_id: CLIENT_ID, callback: handleCredential });
        btnRef.current.replaceChildren();
        id.renderButton(btnRef.current, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          shape: "pill",
          text: "continue_with",
          logo_alignment: "center",
          width,
        });
      })
      .catch(() => onError?.("Couldn't load Google sign-in. Please retry."));
    return () => {
      cancelled = true;
    };
  }, [handleCredential, onError, width]);

  return (
    <div ref={wrapRef} className="group relative w-full">
      {/* Visible design button (non-interactive; the overlay handles the click). */}
      <div className="pointer-events-none">{children}</div>
      {/* Real Google button, transparent, on top — captures the click. */}
      <div
        ref={btnRef}
        aria-hidden
        className="absolute inset-0 z-10 flex items-center justify-center opacity-0"
      />
    </div>
  );
}
