"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { Wallpaper } from "@/types/wallpaper";
import { cn } from "@/lib/utils";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
}

export function WallpaperCard({ wallpaper }: WallpaperCardProps) {
  const [favorited, setFavorited] = useState(wallpaper.isFavorite ?? false);
  const [loaded, setLoaded] = useState(false);

  return (
    <article className="group relative">
      <div className="relative overflow-hidden bg-hw-card">
        <Link
          href={`/wallpaper/${wallpaper.slug}`}
          className="relative block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hw-green/50"
          aria-label={`View ${wallpaper.title}`}
        >
          <div className="relative aspect-[9/16] w-full sm:aspect-[16/10]">
            <Image
              src={wallpaper.image}
              alt={wallpaper.title}
              fill
              className={cn(
                "object-cover transition-transform duration-500 group-hover:scale-[1.02]",
                loaded ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 1024px) 50vw, 33vw"
              onLoad={() => setLoaded(true)}
            />
            {!loaded && (
              <div className="absolute inset-0 animate-pulse bg-hw-surface" />
            )}

            {/* HDQwalls-style hover: title on a gradient that fades in */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-3 pb-2.5 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="line-clamp-2 text-[13px] font-medium leading-tight text-white drop-shadow">
                {wallpaper.title}
              </p>
            </div>
          </div>
        </Link>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFavorited(!favorited);
          }}
          className={cn(
            "absolute right-2 top-2 z-10 flex size-7 items-center justify-center",
            !favorited &&
              "rounded-full bg-black/55 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
          )}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "size-4",
              favorited ? "fill-red-500 text-red-500" : "text-white"
            )}
          />
        </button>
      </div>
    </article>
  );
}
