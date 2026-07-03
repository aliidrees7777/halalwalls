"use client";

import { useCallback } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import type { WallpaperDetail } from "@/types/wallpaper";

/** Normalise "1920×1080" / "1920x1080" for the download API. */
export function toDownloadResolution(resolution: string): string {
  return resolution.toLowerCase().replace(/×/g, "x").replace(/\s/g, "");
}

export function useWallpaperDownload(wallpaper: WallpaperDetail) {
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const locked = !!wallpaper.isPremium && !user?.isPremium;

  const download = useCallback(
    async (resolution: string) => {
      if (!isAuthenticated) {
        openAuthModal("signin");
        return false;
      }
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
        if (e instanceof ApiError && e.statusCode === 401) {
          openAuthModal("signin");
          return false;
        }
        if (e instanceof ApiError && e.statusCode === 403) {
          openAuthModal("premium");
          return false;
        }
        console.error(e);
        return false;
      }
    },
    [isAuthenticated, locked, openAuthModal, wallpaper.slug]
  );

  return { download, locked };
}
