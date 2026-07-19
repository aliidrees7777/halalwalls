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
        window.open(data.url, "_blank", "noopener");
        return true;
      } catch (e) {
        if (e instanceof ApiError && e.statusCode === 403) {
          openAuthModal("premium");
          return false;
        }
        console.error(e);
        return false;
      }
    },
    [locked, openAuthModal, wallpaper.slug],
  );

  return { download, locked };
}
