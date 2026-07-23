"use client";

import { useCallback } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import type { WallpaperDetail } from "@/types/wallpaper";
import { hasPremiumAccess } from "@/lib/premium-access";

/** Normalise "1920×1080" / "1920x1080" for the download API. */
export function toDownloadResolution(resolution: string): string {
  return resolution.toLowerCase().replace(/×/g, "x").replace(/\s/g, "");
}

/** Trigger a same-tab file save from a blob (no new window/tab). */
function saveBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after the browser has a chance to start the download.
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2_000);
}

function filenameFromDisposition(header: string | null, fallback: string) {
  if (!header) return fallback;
  const utf = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf?.[1]) {
    try {
      return decodeURIComponent(utf[1].trim());
    } catch {
      /* ignore */
    }
  }
  const plain = header.match(/filename="?([^";]+)"?/i);
  return plain?.[1]?.trim() || fallback;
}

export function useWallpaperDownload(wallpaper: WallpaperDetail) {
  const { openAuthModal, user } = useAuth();
  // Guests may download free wallpapers (ads will gate the button later).
  // Premium wallpapers still require an entitled account.
  const locked = !!wallpaper.isPremium && !hasPremiumAccess(user);

  const download = useCallback(
    async (resolution: string) => {
      if (locked) {
        openAuthModal("premium");
        return false;
      }

      try {
        const data = await api.post<{
          url: string;
          downloadCount: number;
          resolution: string;
        }>(`/wallpapers/${wallpaper.slug}/download`, {
          resolution: toDownloadResolution(resolution),
        });

        // Fetch the file in-page and save via a temporary <a download>,
        // so the UI animation can finish without opening a new tab.
        const res = await fetch(data.url, { credentials: "omit" });
        if (!res.ok) {
          throw new ApiError(`Download failed (${res.status})`, res.status);
        }
        const blob = await res.blob();
        const titleBase = wallpaper.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        const fallback = `${titleBase || wallpaper.slug}-halalwalls.jpg`;
        const filename = filenameFromDisposition(
          res.headers.get("Content-Disposition"),
          fallback,
        );
        saveBlob(blob, filename);
        return true;
      } catch (e) {
        if (e instanceof ApiError && e.statusCode === 403) {
          openAuthModal("premium");
          return false;
        }
        if (e instanceof ApiError && (e.statusCode === 401 || e.isAuth)) {
          openAuthModal("signin");
          return false;
        }
        console.error(e);
        return false;
      }
    },
    [locked, openAuthModal, wallpaper.slug, wallpaper.title],
  );

  return { download, locked };
}
