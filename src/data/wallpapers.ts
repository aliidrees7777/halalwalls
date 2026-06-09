import type { Wallpaper } from "@/types/wallpaper";
import { slugify } from "@/lib/slug";

const rawWallpapers: Omit<Wallpaper, "slug">[] = [
  {
    id: "1",
    title: "Neon Metropolis",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80",
    category: "space",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Prehistoric Valley",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    category: "movies",
    resolution: "2560x1440",
  },
  {
    id: "3",
    title: "Warrior Sunset",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80",
    category: "anime",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "4",
    title: "Infinite Domain",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&q=80",
    category: "anime",
    resolution: "3840x2160",
  },
  {
    id: "5",
    title: "Crimson Guardian",
    image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=1200&q=80",
    category: "superheroes",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "6",
    title: "Alpine Reflection",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    category: "minimalist",
    resolution: "2560x1440",
  },
  {
    id: "7",
    title: "Velocity GT",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    category: "cars",
    resolution: "1920x1080",
  },
  {
    id: "8",
    title: "Mecha Protocol",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1200&q=80",
    category: "gaming",
    resolution: "3440x1440",
    isFavorite: true,
  },
  {
    id: "9",
    title: "The Batman Silent Watcher In The Night",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&q=85",
    category: "superheroes",
    resolution: "2560x1440",
    isFavorite: false,
  },
  {
    id: "10",
    title: "Web Slinger",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1200&q=80",
    category: "superheroes",
    resolution: "2560x1440",
    isFavorite: true,
  },
  {
    id: "11",
    title: "Crow Moon",
    image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=1200&q=80",
    category: "anime",
    resolution: "1920x1080",
  },
  {
    id: "12",
    title: "Desert Hauler",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80",
    category: "cars",
    resolution: "3840x2160",
  },
  {
    id: "13",
    title: "Cyber Grid",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
    category: "gaming",
    resolution: "1920x1080",
  },
  {
    id: "14",
    title: "Galaxy Drift",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80",
    category: "space",
    resolution: "2560x1440",
  },
  {
    id: "15",
    title: "Stadium Lights",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80",
    category: "sport",
    resolution: "1920x1080",
  },
  {
    id: "16",
    title: "Sakura Bloom",
    image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1200&q=80",
    category: "anime",
    resolution: "1920x1080",
    isFavorite: true,
  },
  {
    id: "17",
    title: "Neon Highway",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80",
    category: "cars",
    resolution: "2560x1440",
  },
  {
    id: "18",
    title: "Mosque Twilight",
    image: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1200&q=80",
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
