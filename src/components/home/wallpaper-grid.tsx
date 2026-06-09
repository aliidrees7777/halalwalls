"use client";

import { useMemo } from "react";
import { gridPageSize, wallpapers } from "@/data/wallpapers";
import { WallpaperCard } from "@/components/home/wallpaper-card";
import { WallpaperGridSkeleton } from "@/components/home/wallpaper-grid-skeleton";
import type { FilterId, Wallpaper } from "@/types/wallpaper";

interface WallpaperGridProps {
  filter: FilterId;
  search: string;
  isLoading: boolean;
}

function toGridPage(items: Wallpaper[]): Wallpaper[] {
  if (items.length === 0) return [];

  const page: Wallpaper[] = [];
  for (let i = 0; i < gridPageSize; i++) {
    page.push(items[i % items.length]);
  }
  return page;
}

export function WallpaperGrid({ filter, search, isLoading }: WallpaperGridProps) {
  const filtered = useMemo(() => {
    let result = [...wallpapers];

    if (filter !== "latest" && filter !== "live" && filter !== "random" && filter !== "popular") {
      result = result.filter((w) => w.category === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q)
      );
    }

    if (filter === "popular") {
      result = [...result].sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
    }

    if (filter === "random") {
      result = [...result].sort(() => Math.random() - 0.5);
    }

    return toGridPage(result);
  }, [filter, search]);

  if (isLoading) {
    return <WallpaperGridSkeleton count={gridPageSize} />;
  }

  if (filtered.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center border border-hw-border bg-hw-card">
        <p className="text-hw-muted">No wallpapers found. Try another filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {filtered.map((wallpaper, index) => (
        <WallpaperCard
          key={`${wallpaper.id}-${index}`}
          wallpaper={wallpaper}
        />
      ))}
    </div>
  );
}
