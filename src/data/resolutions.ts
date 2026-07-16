import type { DownloadResolution } from "@/types/wallpaper";

/** Site-wide catalog: 3 desktop + 3 mobile (filtered per wallpaper by source size). */
export const desktopDownloadResolutions: DownloadResolution[] = [
  { label: "1920×1080", width: 1920, height: 1080, fileSizeMB: 1.42, device: "desktop" },
  { label: "2560×1440", width: 2560, height: 1440, fileSizeMB: 2.18, device: "desktop" },
  { label: "3840×2160", width: 3840, height: 2160, fileSizeMB: 4.86, device: "desktop" },
];

export const mobileDownloadResolutions: DownloadResolution[] = [
  { label: "1080×2400", width: 1080, height: 2400, fileSizeMB: 1.64, device: "mobile" },
  { label: "1290×2796", width: 1290, height: 2796, fileSizeMB: 1.92, device: "mobile" },
  { label: "1320×2868", width: 1320, height: 2868, fileSizeMB: 2.04, device: "mobile" },
];

/** Keep only sizes the source can cover without upscaling. */
export function filterResolutionsForSource(
  items: DownloadResolution[],
  sourceWidth?: number | null,
  sourceHeight?: number | null,
): DownloadResolution[] {
  const sw = Number(sourceWidth) || 0;
  const sh = Number(sourceHeight) || 0;
  if (!sw || !sh) return [];
  return items.filter((r) => r.width <= sw && r.height <= sh);
}
