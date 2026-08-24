"use client";

import { useEffect, useRef } from "react";
import { api } from "@/lib/api";

/**
 * Fires a lightweight view ping once per mount.
 * Kept off the cached GET /wallpapers/:slug path so ISR does not under-count.
 */
export function RecordWallpaperView({ slug }: { slug: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (!slug || sent.current) return;
    sent.current = true;

    api.post(`/wallpapers/${encodeURIComponent(slug)}/view`).catch(() => {
      // Analytics is best-effort — never surface errors to the user.
    });
  }, [slug]);

  return null;
}
