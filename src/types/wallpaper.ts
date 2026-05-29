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
}

export interface WallpaperDetail extends Wallpaper {
  categoryLabel: string;
  tags: string[];
  tagSlugs: string[];
  publishedAt: string;
  views: number;
  author: string;
  originalResolution: string;
  originalSizeMB: number;
  preferredResolution: string;
  relatedIds: string[];
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
