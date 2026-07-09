"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Wallpaper } from "@/types/wallpaper";
import { cn } from "@/lib/utils";
import { resolveMediaUrl, shouldUnoptimizeMedia } from "@/lib/media-url";

interface ProfileCarouselThumbProps {
  wallpaper: Wallpaper;
  className?: string;
}

/** Figma carousel card — 124.2px wide, portrait, 0.634px border */
export function ProfileCarouselThumb({
  wallpaper,
  className,
}: ProfileCarouselThumbProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageSrc = resolveMediaUrl(wallpaper.image);

  return (
    <Link
      href={`/wallpaper/${wallpaper.slug}`}
      className={cn(
        "relative h-full w-[124.2px] shrink-0 overflow-hidden rounded-[3.802px] border-[0.634px] border-[#5b6268] bg-hw-card",
        className,
      )}
      aria-label={`View ${wallpaper.title}`}
    >
      {!failed ? (
        <Image
          src={imageSrc}
          alt={wallpaper.title}
          fill
          unoptimized={shouldUnoptimizeMedia(imageSrc)}
          className={cn("object-cover", loaded ? "opacity-100" : "opacity-0")}
          sizes="124px"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex size-full items-center justify-center px-2 text-center text-[10px] text-hw-muted">
          Unavailable
        </div>
      )}
      {!loaded && !failed ? (
        <div className="absolute inset-0 animate-pulse bg-hw-surface" />
      ) : null}
    </Link>
  );
}
