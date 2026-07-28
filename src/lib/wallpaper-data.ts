import { cache } from "react";
import { api } from "@/lib/api";
import type { Wallpaper, WallpaperDetail } from "@/types/wallpaper";

/**
 * Per-request memoized wallpaper fetch.
 * Dedupes generateMetadata + page so we don't hit the API twice on navigation.
 */
export const getWallpaperBySlug = cache(async (slug: string) => {
  return api.get<{ wallpaper: WallpaperDetail }>(`/wallpapers/${slug}`, {
    cache: "no-store",
  });
});

export const getRelatedWallpapers = cache(async (slug: string) => {
  return api.get<{ wallpapers: Wallpaper[] }>(`/wallpapers/${slug}/related`, {
    cache: "no-store",
  });
});
