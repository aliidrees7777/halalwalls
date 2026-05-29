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
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&q=80",
  banner:
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&h=600&fit=crop&q=80",
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
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=500&fit=crop&q=80",
    category: "superheroes",
    resolution: "2560x1440",
  },
  {
    id: "d2",
    slug: "crimson-mask",
    title: "Crimson Mask",
    image:
      "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800&h=500&fit=crop&q=80",
    category: "gaming",
    resolution: "1920x1080",
  },
  {
    id: "d3",
    slug: "cosmic-drift",
    title: "Cosmic Drift",
    image:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=500&fit=crop&q=80",
    category: "space",
    resolution: "3840x2160",
  },
  {
    id: "d4",
    slug: "anime-warrior",
    title: "Anime Warrior",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=500&fit=crop&q=80",
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
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=500&fit=crop&q=80",
    category: "gaming",
    resolution: "2560x1440",
    isFavorite: true,
  },
  {
    id: "f2",
    slug: "forest-sunset",
    title: "Forest Sunset",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&q=80",
    category: "minimalist",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "f3",
    slug: "power-aura",
    title: "Power Aura",
    image:
      "https://images.unsplash.com/photo-1613376023733-0a73368d0ef4?w=800&h=500&fit=crop&q=80",
    category: "anime",
    resolution: "3840x2160",
    isFavorite: true,
  },
  {
    id: "f4",
    slug: "neon-rain",
    title: "Neon Rain",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=500&fit=crop&q=80",
    category: "gaming",
    resolution: "2560x1440",
    isFavorite: true,
  },
];
