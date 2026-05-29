import type { DownloadResolution } from "@/types/wallpaper";

export const desktopDownloadResolutions: DownloadResolution[] = [
  { label: "1920×1080", width: 1920, height: 1080, fileSizeMB: 1.42, device: "desktop" },
  { label: "2560×1440", width: 2560, height: 1440, fileSizeMB: 2.18, device: "desktop" },
  { label: "3840×2160", width: 3840, height: 2160, fileSizeMB: 4.86, device: "desktop" },
  { label: "1280×720", width: 1280, height: 720, fileSizeMB: 0.88, device: "desktop" },
  { label: "1366×768", width: 1366, height: 768, fileSizeMB: 0.94, device: "desktop" },
  { label: "1600×900", width: 1600, height: 900, fileSizeMB: 1.12, device: "desktop" },
];

export const mobileDownloadResolutions: DownloadResolution[] = [
  { label: "1080×2400", width: 1080, height: 2400, fileSizeMB: 1.64, device: "mobile" },
  { label: "1290×2796", width: 1290, height: 2796, fileSizeMB: 1.92, device: "mobile" },
  { label: "1320×2868", width: 1320, height: 2868, fileSizeMB: 2.04, device: "mobile" },
  { label: "1170×2532", width: 1170, height: 2532, fileSizeMB: 1.78, device: "mobile" },
  { label: "1440×3200", width: 1440, height: 3200, fileSizeMB: 2.28, device: "mobile" },
  { label: "1080×2340", width: 1080, height: 2340, fileSizeMB: 1.58, device: "mobile" },
];
