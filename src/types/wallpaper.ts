export type FilterId =
  | "latest"
  | "live"
  | "random"
  | "popular"
  | "islamic"
  | "anime"
  | "superheroes"
  | "minimalist"
  | "gaming"
  | "movies"
  | "cars"
  | "sport"
  | "space";

export interface Wallpaper {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: FilterId;
  resolution: string;
  isFavorite?: boolean;
  isPremium?: boolean;
  // Optional fields returned by the backend catalog API.
  isLive?: boolean;
  downloadCount?: number;
  views?: number;
  favoritesCount?: number;
}

export interface WallpaperDetail extends Wallpaper {
  categoryLabel: string;
  tags: string[];
  tagSlugs: string[];
  publishedAt: string;
  views: number;
  author: string;
  /** Original credit URL (e.g. Instagram profile) when provided at upload. */
  description?: string;
  originalResolution: string;
  originalSizeMB: number;
  preferredResolution: string;
  /** Friendly label for primary download (4K / 2K / Full HD). */
  preferredResolutionLabel?: string;
  relatedIds: string[];
  /** Source pixel size (used to filter download options). */
  width?: number | null;
  height?: number | null;
  /** Keys of sizes offered for this wallpaper (same + below only). */
  resolutions?: string[];
  /** Pre-filtered 3 desktop + 3 mobile catalog for this wallpaper. */
  downloadResolutions?: {
    desktop: DownloadResolution[];
    mobile: DownloadResolution[];
  };
}

export interface SidebarCategory {
  name: string;
  count: number;
  isPremium?: boolean;
  slug?: FilterId;
}

export interface FilterPill {
  id: FilterId;
  label: string;
  icon?: "rocket" | "play" | "shuffle" | "flame";
}

export interface DownloadResolution {
  label: string;
  width: number;
  height: number;
  fileSizeMB: number;
  device: "desktop" | "mobile";
}
