import {
  desktopDownloadResolutions,
  filterResolutionsForSource,
  mobileDownloadResolutions,
} from "@/data/resolutions";
import type { DownloadResolution, WallpaperDetail } from "@/types/wallpaper";

/** Normalize "1920×1080" / "1920x1080" for comparisons. */
export function normalizeResKey(value: string): string {
  return value.toLowerCase().replace(/×/g, "x").replace(/\s/g, "");
}

const QUALITY_LABELS: Record<string, string> = {
  "1920x1080": "Full HD",
  "2560x1440": "2K",
  "3840x2160": "4K",
};

/** Friendly quality name when known (Full HD / 2K / 4K). */
export function qualityLabelForResolution(key: string): string | null {
  return QUALITY_LABELS[normalizeResKey(key)] ?? null;
}

/** All download sizes offered for this wallpaper (desktop + mobile). */
export function availableDownloadResolutions(
  wallpaper: WallpaperDetail,
): DownloadResolution[] {
  const desktop =
    wallpaper.downloadResolutions?.desktop ??
    filterResolutionsForSource(
      desktopDownloadResolutions,
      wallpaper.width,
      wallpaper.height,
    );
  const mobile =
    wallpaper.downloadResolutions?.mobile ??
    filterResolutionsForSource(
      mobileDownloadResolutions,
      wallpaper.width,
      wallpaper.height,
    );
  return [...desktop, ...mobile];
}

/** Find a catalog size matching a browse/filter key, if this wallpaper can serve it. */
export function findAvailableResolution(
  wallpaper: WallpaperDetail,
  key: string | null | undefined,
): DownloadResolution | null {
  if (!key?.trim()) return null;
  const want = normalizeResKey(key);
  return (
    availableDownloadResolutions(wallpaper).find(
      (r) => normalizeResKey(r.label) === want,
    ) ?? null
  );
}
