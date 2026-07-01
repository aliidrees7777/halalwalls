"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

/** Normalise "1920×1080" / "1920 x 1080" → "1920x1080"; anything else → "original". */
export function normalizeResolution(input: string): string {
  const s = (input || "").toLowerCase().replace(/[×\s]/g, "x").trim();
  return /^\d{2,5}x\d{2,5}$/.test(s) ? s : "original";
}

interface DownloadableWallpaper {
  slug: string;
  isPremium?: boolean;
}

/**
 * Trigger a file download from a URL. Uses a temporary <a> element instead of
 * window.open — window.open() called after an `await` is treated as an
 * unsolicited pop-up and blocked by browsers, so nothing happens. The backend
 * sends `Content-Disposition: attachment`, so the link downloads without
 * navigating away.
 */
function triggerDownload(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Shared wallpaper download flow — used by the download buttons and the
 * per-resolution links. Enforces auth + premium gating, requests a signed
 * file link for the chosen resolution, and opens it (the browser downloads
 * the rendered image). `downloading` holds the resolution key in flight.
 */
export function useWallpaperDownload(wallpaper: DownloadableWallpaper) {
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const locked = !!wallpaper.isPremium && !user?.isPremium;

  async function download(resolution: string) {
    setError(null);
    if (!isAuthenticated) {
      openAuthModal("signin");
      return;
    }
    if (locked) {
      openAuthModal("premium");
      return;
    }
    const res = resolution === "original" ? "original" : normalizeResolution(resolution);
    setDownloading(res);
    try {
      const data = await api.post<{ url: string; resolution: string }>(
        `/wallpapers/${wallpaper.slug}/download`,
        { resolution: res },
      );
      if (data.url) triggerDownload(data.url);
      else throw new Error("No download URL");
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 401) {
        openAuthModal("signin");
        return;
      }
      if (e instanceof ApiError && e.statusCode === 403) {
        openAuthModal("premium");
        return;
      }
      setError(e instanceof ApiError ? e.message : "Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  }

  return { download, downloading, locked, error };
}
