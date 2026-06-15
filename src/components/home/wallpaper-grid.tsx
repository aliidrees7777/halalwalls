"use client";

import { WallpaperCard } from "@/components/home/wallpaper-card";
import { WallpaperGridSkeleton } from "@/components/home/wallpaper-grid-skeleton";
import type { Wallpaper } from "@/types/wallpaper";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  isLoading: boolean;
}

export function WallpaperGrid({ wallpapers, isLoading }: WallpaperGridProps) {
  if (isLoading) {
    return <WallpaperGridSkeleton count={18} />;
  }

  if (!wallpapers || wallpapers.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center border border-hw-border bg-hw-card">
        <p className="text-hw-muted">No wallpapers found. Try another filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1 lg:grid-cols-3">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
      ))}
    </div>
  );
}