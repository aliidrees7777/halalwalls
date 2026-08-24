import { cache } from "react";
import { api } from "@/lib/api";
import type { Wallpaper, WallpaperDetail } from "@/types/wallpaper";

/** Time-based ISR window for wallpaper detail (seconds). */
export const WALLPAPER_REVALIDATE_SECONDS = 60;

/** Shared tag — bust all wallpaper detail entries after catalog mutations. */
export const WALLPAPERS_CACHE_TAG = "wallpapers";

export function wallpaperCacheTag(slug: string) {
  return `wallpaper-${slug}`;
}

export type WallpaperBySlugResponse = {
  wallpaper: WallpaperDetail;
  /** Included by the detail endpoint — avoids a second /related round trip. */
  related?: Wallpaper[];
};

/**
 * Per-request memoized wallpaper fetch (React.cache) + Next Data Cache (ISR).
 * Dedupes generateMetadata + page within one render, and reuses the HTTP
 * response across navigations for WALLPAPER_REVALIDATE_SECONDS.
 */
export const getWallpaperBySlug = cache(async (slug: string) => {
  return api.get<WallpaperBySlugResponse>(`/wallpapers/${slug}`, {
    next: {
      revalidate: WALLPAPER_REVALIDATE_SECONDS,
      tags: [wallpaperCacheTag(slug), WALLPAPERS_CACHE_TAG],
    },
  });
});

/** Standalone related endpoint (kept for callers that only need related). */
export const getRelatedWallpapers = cache(async (slug: string) => {
  return api.get<{ wallpapers: Wallpaper[] }>(`/wallpapers/${slug}/related`, {
    next: {
      revalidate: WALLPAPER_REVALIDATE_SECONDS,
      tags: [wallpaperCacheTag(slug), WALLPAPERS_CACHE_TAG],
    },
  });
});
