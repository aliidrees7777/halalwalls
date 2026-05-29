import type { SidebarCategory } from "@/types/wallpaper";

/** Resolution chips shown in sidebar (3× grid per SS) */
export const desktopResolutions = ["1920×1080", "2560×1440", "3840×2160"];

export const mobileResolutions = ["1080×2400", "1290×2796", "1320×2868"];

export const trendingTopics = [
  "GTA VI",
  "Spiderman",
  "Jujutsu Kaisen",
  "Joker",
  "Iron Man",
  "Wolverine",
];

/** Category list order and counts from design */
export const sidebarCategories: SidebarCategory[] = [
  { name: "Islamic", count: 100, slug: "islamic" },
  { name: "Anime", count: 70, slug: "anime" },
  { name: "Premium Walls", count: 70, isPremium: true },
  { name: "Superheroes", count: 55, slug: "superheroes" },
  { name: "Minimalist", count: 40, slug: "minimalist" },
  { name: "Gaming", count: 33, slug: "gaming" },
  { name: "Movies", count: 30, slug: "movies" },
  { name: "Live Walls", count: 28, slug: "live" },
  { name: "Cars", count: 25, slug: "cars" },
  { name: "Sport", count: 22, slug: "sport" },
  { name: "Space", count: 18, slug: "space" },
  { name: "Animals", count: 14 },
  { name: "TV Shows", count: 9 },
  { name: "3D", count: 3 },
];
