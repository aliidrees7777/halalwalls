"use client";

import { useEffect, useState } from "react";
import { resolveMediaUrl } from "@/lib/media-url";

/**
 * Desktop image on lg+; mobile image on phones when a dedicated mobile
 * upload exists (falls back to desktop).
 */
export function useDevicePreviewSrc(
  desktopImage?: string | null,
  mobileImage?: string | null,
): string {
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setIsMobileViewport(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const raw =
    isMobileViewport && mobileImage ? mobileImage : desktopImage || "";
  return resolveMediaUrl(raw);
}
