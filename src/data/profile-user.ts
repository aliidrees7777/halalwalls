import type { Wallpaper } from "@/types/wallpaper";

export interface ProfileUser {
  id: string;
  name: string;
  bio: string;
  email: string;
  avatar: string;
  banner: string;
  isPremium: boolean;
  favoritesCount: number;
  uploadsCount: number;
}

export const demoProfileUser: ProfileUser = {
  id: "user-hossein",
  name: "Hossein Rivandi",
  bio: "A Pro level Artist and Photographer",
  email: "HRivandi@gmail.com",
  avatar:
    "/my-account/profile.png",
  banner:
    "/small-memory-lp.jpg",
  isPremium: true,
  favoritesCount: 5,
  uploadsCount: 0,
};

export const discoverJustUploaded: Wallpaper[] = [
  {
    id: "d1",
    slug: "spider-verse-hero",
    title: "Spider-Verse Hero",
    image:
      "/miles-morales-sitting-alone-7k-2550x1435.jpg",
    category: "superheroes",
    resolution: "2560x1440",
  },
  {
    id: "d2",
    slug: "crimson-mask",
    title: "Crimson Mask",
    image:
      "/v-for-vendetta-2026-uz-2550x1435.jpg",
    category: "gaming",
    resolution: "1920x1080",
  },
  {
    id: "d3",
    slug: "cosmic-drift",
    title: "Cosmic Drift",
    image:
      "/spiderman-miles-lost-in-space-4k-0f-2550x1435.jpg",
    category: "space",
    resolution: "3840x2160",
  },
  {
    id: "d4",
    slug: "anime-warrior",
    title: "Anime Warrior",
    image:
      "/itachi-uchiha-the-villain-who-was-always-the-hero-no-2550x1435.jpg",
    category: "anime",
    resolution: "1920x1080",
  },
];

export const profileFavorites: Wallpaper[] = [
  {
    id: "f1",
    slug: "medieval-battlefield",
    title: "Medieval Battlefield",
    image:
      "/hf_20260326_164049_8974aeb1-5fda-4ce2-a53e-8ef40197514c.jpeg",
    category: "gaming",
    resolution: "2560x1440",
    isFavorite: true,
  },
  {
    id: "f2",
    slug: "forest-sunset",
    title: "Forest Sunset",
    image:
      "/small-memory-lp.jpg",
    category: "minimalist",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "f3",
    slug: "power-aura",
    title: "Power Aura",
    image:
      "/goku-super-saiyan-blue-against-all-gods-hv-2550x1435.jpg",
    category: "anime",
    resolution: "3840x2160",
    isFavorite: true,
  },
  {
    id: "f4",
    slug: "neon-rain",
    title: "Neon Rain",
    image:
      "/gta-6-the-next-chapter-begins-rg-2550x1435.jpg",
    category: "gaming",
    resolution: "2560x1440",
    isFavorite: true,
  },
];
