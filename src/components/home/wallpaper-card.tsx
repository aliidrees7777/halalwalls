"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Wallpaper } from "@/types/wallpaper";
import { useFavorite } from "@/hooks/use-favorite";
import { useDevicePreviewSrc } from "@/hooks/use-device-preview-src";
import { cn } from "@/lib/utils";
import { shouldUnoptimizeMedia } from "@/lib/media-url";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
}

export function WallpaperCard({ wallpaper }: WallpaperCardProps) {
  const searchParams = useSearchParams();
  const { isFavorite: favorited, toggle } = useFavorite(
    wallpaper.id,
    wallpaper.favoritesCount ?? 0
  );
  const [loaded, setLoaded] = useState(false);
  const imageSrc = useDevicePreviewSrc(wallpaper.image, wallpaper.mobileImage);

  useEffect(() => {
    setLoaded(false);
  }, [imageSrc]);

  // Carry browse resolution onto the detail page so the primary download
  // matches the sidebar filter the user picked on the homepage.
  const resolution = searchParams.get("resolution");
  const detailHref = resolution
    ? `/wallpaper/${wallpaper.slug}?resolution=${encodeURIComponent(resolution)}`
    : `/wallpaper/${wallpaper.slug}`;

  return (
    <article className="group relative mx-auto aspect-[198/440] w-full max-w-[198px] lg:mx-0 lg:max-w-none lg:aspect-[449/254] lg:w-full">
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-hw-card",
          "rounded-[6.06061px] border-[1.0101px] border-solid border-[#5B6268]",
          "lg:rounded-[var(--lp-card-radius)] lg:border-[length:var(--lp-card-border)] lg:border-hw-line",
        )}
      >
        <Link
          href={detailHref}
          className="relative block h-full w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hw-green/50 focus-visible:ring-inset"
          aria-label={`View ${wallpaper.title}`}
        >
          <Image
            src={imageSrc}
            alt={wallpaper.title}
            fill
            unoptimized={shouldUnoptimizeMedia(imageSrc)}
            className={cn(
              "object-cover",
              loaded ? "opacity-100" : "opacity-0",
            )}
            sizes="(max-width: 1023px) 198px, 33vw"
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
        </Link>

        {wallpaper.isPremium ? (
          <Image
            src="/Premium Icon.svg"
            alt=""
            width={25}
            height={25}
            unoptimized
            aria-hidden
            className="pointer-events-none absolute left-2 top-2 z-10 size-[25px]"
          />
        ) : null}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }}
          className={cn(
            "absolute right-2 top-2 z-10 flex size-7 items-center justify-center",
            !favorited &&
              "rounded-full bg-black/55 opacity-100 backdrop-blur-sm transition-opacity lg:opacity-0 lg:group-hover:opacity-100",
          )}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "size-4",
              favorited ? "fill-red-500 text-red-500" : "text-white",
            )}
          />
        </button>
      </div>
    </article>
  );
}
