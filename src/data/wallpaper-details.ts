import type { FilterId, Wallpaper, WallpaperDetail } from "@/types/wallpaper";
import { slugify } from "@/lib/slug";
import { getRelatedWallpapers, wallpapers } from "@/data/wallpapers";

const categoryLabels: Record<FilterId, string> = {
  latest: "Latest",
  live: "Live Walls",
  random: "Random",
  popular: "Popular",
  islamic: "Islamic",
  anime: "Anime",
  superheroes: "Superheroes",
  minimalist: "Minimalist",
  gaming: "Gaming",
  movies: "Movies",
  cars: "Cars",
  sport: "Sport",
  space: "Space",
};

const detailOverrides: Partial<
  Record<
    string,
    Pick<
      WallpaperDetail,
      | "tags"
      | "tagSlugs"
      | "publishedAt"
      | "views"
      | "author"
      | "originalResolution"
      | "originalSizeMB"
      | "preferredResolution"
      | "relatedIds"
    >
  >
> = {
  "9": {
    tags: [
      "The Batman",
      "Batman",
      "Superheroes",
      "DC Comics",
      "Dark Knight",
      "Gotham",
      "Comic Book",
    ],
    tagSlugs: [
      "the-batman-wallpapers",
      "batman-wallpapers",
      "superheroes-wallpapers",
      "dc-comics-wallpapers",
      "dark-knight-wallpapers",
      "gotham-wallpapers",
      "comic-book-wallpapers",
    ],
    publishedAt: "March 4, 2024",
    views: 1000,
    author: "halalwalls",
    originalResolution: "5077×2856",
    originalSizeMB: 3.12,
    preferredResolution: "2560×1440",
    relatedIds: ["5", "10", "13", "3", "8"],
  },
};

function buildTags(wallpaper: Wallpaper): string[] {
  const category = categoryLabels[wallpaper.category];
  const words = wallpaper.title.split(/\s+/).slice(0, 3);
  return [wallpaper.title, ...words, category].filter(
    (tag, index, arr) => arr.indexOf(tag) === index
  );
}

function buildTagSlugs(tags: string[]): string[] {
  return tags.map((tag) => `${slugify(tag)}-wallpapers`);
}

function hashSeed(id: string): number {
  return id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function getWallpaperDetail(slug: string): WallpaperDetail | null {
  const wallpaper = wallpapers.find((w) => w.slug === slug);
  if (!wallpaper) return null;

  const override = detailOverrides[wallpaper.id];
  const tags = override?.tags ?? buildTags(wallpaper);
  const tagSlugs = override?.tagSlugs ?? buildTagSlugs(tags);
  const seed = hashSeed(wallpaper.id);
  const related =
    override?.relatedIds
      ?.map((id) => wallpapers.find((w) => w.id === id))
      .filter((w): w is Wallpaper => Boolean(w)) ??
    getRelatedWallpapers(wallpaper.id, wallpaper.category);

  return {
    ...wallpaper,
    categoryLabel: categoryLabels[wallpaper.category],
    tags,
    tagSlugs,
    publishedAt: override?.publishedAt ?? "January 12, 2025",
    views: override?.views ?? 320 + (seed % 900),
    author: override?.author ?? "halalwalls",
    originalResolution: override?.originalResolution ?? "3840×2160",
    originalSizeMB: override?.originalSizeMB ?? 2.4 + (seed % 10) / 10,
    preferredResolution:
      override?.preferredResolution ??
      wallpaper.resolution.replace("x", "×"),
    relatedIds: related.map((w) => w.id),
  };
}

export function getRelatedForDetail(detail: WallpaperDetail): Wallpaper[] {
  return detail.relatedIds
    .map((id) => wallpapers.find((w) => w.id === id))
    .filter((w): w is Wallpaper => Boolean(w));
}

export function getAllWallpaperSlugs(): string[] {
  return wallpapers.map((w) => w.slug);
}
