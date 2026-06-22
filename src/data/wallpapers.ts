import type { Wallpaper } from "@/types/wallpaper";
import { slugify } from "@/lib/slug";

const rawWallpapers: Omit<Wallpaper, "slug">[] = [
  {
    id: "1",
    title: "Neon Metropolis",
    image: "/satoru-gojo-end-game-tf-2550x1435.jpg",
    category: "space",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Prehistoric Valley",
    image: "/novitec-lamborghini-revuelto-exotic-carbon-machine-7t-2550x1435.jpg",
    category: "movies",
    resolution: "2560x1440",
  },
  {
    id: "3",
    title: "Warrior Sunset",
    image: "/spiderman-miles-lost-in-space-4k-0f-2550x1435.jpg",
    category: "anime",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "4",
    title: "Infinite Domain",
    image: "/itachi-uchiha-the-villain-who-was-always-the-hero-no-2550x1435.jpg",
    category: "anime",
    resolution: "3840x2160",
  },
  {
    id: "5",
    title: "Crimson Guardian",
    image: "/nordland-norway-lk-2550x1435.jpg",
    category: "superheroes",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "6",
    title: "Alpine Reflection",
    image: "/darth-vader-became-a-legend-dn-2550x1435.jpg",
    category: "minimalist",
    resolution: "2560x1440",
  },
  {
    id: "7",
    title: "Velocity GT",
    image: "/shinrabansho-man-a2-2550x1435.jpg",
    category: "cars",
    resolution: "1920x1080",
  },
  {
    id: "8",
    title: "Mecha Protocol",
    image: "/goku-super-saiyan-blue-against-all-gods-hv-2550x1435.jpg",
    category: "gaming",
    resolution: "3440x1440",
    isFavorite: true,
  },
  {
    id: "9",
    title: "The Batman Silent Watcher In The Night",
    image: "/batman-is-not-a-replacement-he-is-a-revolution-4i-2550x1435.jpg",
    category: "superheroes",
    resolution: "2560x1440",
    isFavorite: false,
  },
  {
    id: "10",
    title: "Web Slinger",
    image: "/itachi-uchiha-the-villain-who-was-always-the-hero-no-2550x1435.jpg",
    category: "superheroes",
    resolution: "2560x1440",
    isFavorite: true,
  },
  {
    id: "11",
    title: "Crow Moon",
    image: "/nordland-norway-lk-2550x1435.jpg",
    category: "anime",
    resolution: "1920x1080",
  },
  {
    id: "12",
    title: "Desert Hauler",
    image: "/darth-vader-became-a-legend-dn-2550x1435.jpg",
    category: "cars",
    resolution: "3840x2160",
  },
  {
    id: "13",
    title: "Cyber Grid",
    image: "/shinrabansho-man-a2-2550x1435.jpg",
    category: "gaming",
    resolution: "1920x1080",
  },
  {
    id: "14",
    title: "Galaxy Drift",
    image: "/goku-super-saiyan-blue-against-all-gods-hv-2550x1435.jpg",
    category: "space",
    resolution: "2560x1440",
  },
  {
    id: "15",
    title: "Stadium Lights",
    image: "/batman-is-not-a-replacement-he-is-a-revolution-4i-2550x1435.jpg",
    category: "sport",
    resolution: "1920x1080",
  },
  {
    id: "16",
    title: "Sakura Bloom",
    image: "/v-for-vendetta-2026-uz-2550x1435.jpg",
    category: "anime",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "17",
    title: "Neon Highway",
    image: "/hf_20260326_164049_8974aeb1-5fda-4ce2-a53e-8ef40197514c.jpeg",
    category: "cars",
    resolution: "2560x1440",
  },
  {
    id: "18",
    title: "Mosque Twilight",
    image: "/gta-6-the-next-chapter-begins-rg-2550x1435.jpg",
    category: "islamic",
    resolution: "1920x1080",
    isFavorite: true,
  },
    {
    id: "19",
    title: "Neon Metropolis",
    image: "/miles-morales-sitting-alone-7k-2550x1435.jpg",
    category: "space",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "20",
    title: "Prehistoric Valley",
    image: "/playstation-logo-5k-wq-2550x1435.jpg",
    category: "movies",
    resolution: "2560x1440",
  },
  {
    id: "21",
    title: "Warrior Sunset",
    image: "/small-memory-lp.jpg",
    category: "anime",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "22",
    title: "Infinite Domain",
    image: "/beautiful-aesthetic-anime-background.jpg",
    category: "anime",
    resolution: "3840x2160",
  },
  {
    id: "23",
    title: "Crimson Guardian",
    image: "/shulk-xenoblade-t4-2550x1435.jpg",
    category: "superheroes",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "24",
    title: "Alpine Reflection",
    image: "/satoru-gojo-end-game-tf-2550x1435.jpg",
    category: "minimalist",
    resolution: "2560x1440",
  },
  {
    id: "25",
    title: "Velocity GT",
    image: "/novitec-lamborghini-revuelto-exotic-carbon-machine-7t-2550x1435.jpg",
    category: "cars",
    resolution: "1920x1080",
  },
  {
    id: "26",
    title: "Mecha Protocol",
    image: "/spiderman-miles-lost-in-space-4k-0f-2550x1435.jpg",
    category: "gaming",
    resolution: "3440x1440",
    isFavorite: true,
  },
  {
    id: "27",
    title: "The Batman Silent Watcher In The Night",
    image: "/itachi-uchiha-the-villain-who-was-always-the-hero-no-2550x1435.jpg",
    category: "superheroes",
    resolution: "2560x1440",
    isFavorite: false,
  },
  {
    id: "28",
    title: "Web Slinger",
    image: "/nordland-norway-lk-2550x1435.jpg",
    category: "superheroes",
    resolution: "2560x1440",
    isFavorite: true,
  },
  {
    id: "29",
    title: "Crow Moon",
    image: "/darth-vader-became-a-legend-dn-2550x1435.jpg",
    category: "anime",
    resolution: "1920x1080",
  },
  {
    id: "30",
    title: "Desert Hauler",
    image: "/shinrabansho-man-a2-2550x1435.jpg",
    category: "cars",
    resolution: "3840x2160",
  },
  {
    id: "31",
    title: "Cyber Grid",
    image: "/goku-super-saiyan-blue-against-all-gods-hv-2550x1435.jpg",
    category: "gaming",
    resolution: "1920x1080",
  },
  {
    id: "32",
    title: "Galaxy Drift",
    image: "/batman-is-not-a-replacement-he-is-a-revolution-4i-2550x1435.jpg",
    category: "space",
    resolution: "2560x1440",
  },
  {
    id: "33",
    title: "Stadium Lights",
    image: "/v-for-vendetta-2026-uz-2550x1435.jpg",
    category: "sport",
    resolution: "1920x1080",
  },
  {
    id: "34",
    title: "Sakura Bloom",
    image: "/hf_20260326_164049_8974aeb1-5fda-4ce2-a53e-8ef40197514c.jpeg",
    category: "anime",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "35",
    title: "Neon Highway",
    image: "/hf_20260326_164049_8974aeb1-5fda-4ce2-a53e-8ef40197514c.jpeg",
    category: "cars",
    resolution: "2560x1440",
  },
  {
    id: "36",
    title: "Mosque Twilight",
    image: "/hf_20260326_164049_8974aeb1-5fda-4ce2-a53e-8ef40197514c.jpeg",
    category: "islamic",
    resolution: "1920x1080",
    isFavorite: true,
  },
];

export const wallpapers: Wallpaper[] = rawWallpapers.map((wallpaper) => ({
  ...wallpaper,
  slug: slugify(wallpaper.title),
}));

export const gridPageSize = 18;

export const totalPages = 100;

export function getWallpaperBySlug(slug: string): Wallpaper | undefined {
  return wallpapers.find((w) => w.slug === slug);
}

export function getRelatedWallpapers(
  currentId: string,
  category: Wallpaper["category"],
  limit = 5
): Wallpaper[] {
  const sameCategory = wallpapers.filter(
    (w) => w.id !== currentId && w.category === category
  );
  const others = wallpapers.filter(
    (w) => w.id !== currentId && w.category !== category
  );
  return [...sameCategory, ...others].slice(0, limit);
}
