"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Wallpaper } from "@/types/wallpaper";
import { useFavorite } from "@/hooks/use-favorite";
import { cn } from "@/lib/utils";
import { resolveMediaUrl, shouldUnoptimizeMedia } from "@/lib/media-url";

type UploadStatus = "active" | "pending" | "hidden";

interface ProfileWallpaperThumbProps {
  wallpaper: Wallpaper & { status?: UploadStatus };
  index?: number;
  /** Extra classes for the media frame (e.g. mobile portrait favorites cards). */
  mediaClassName?: string;
}

function StatusPill({ status }: { status?: UploadStatus }) {
  if (!status || status === "active") return null;
  const isPending = status === "pending";
  return (
    <span
      className={cn(
        "absolute left-2 top-2 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        isPending
          ? "bg-[#2F2805] text-[#E8B84A]"
          : "bg-[#1a1a1a] text-[#ef4444]",
      )}
    >
      {isPending ? "Pending" : "Rejected"}
    </span>
  );
}

export function ProfileWallpaperThumb({
  wallpaper,
  index = 0,
  mediaClassName,
}: ProfileWallpaperThumbProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageSrc = resolveMediaUrl(wallpaper.image);
  const status = wallpaper.status;
  const isPublished = !status || status === "active";
  const { isFavorite: favorited, toggle } = useFavorite(
    wallpaper.id,
    wallpaper.favoritesCount ?? 0,
  );

  const media = (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-[var(--lp-card-radius)] border-[length:var(--lp-card-border)] border-hw-line bg-hw-card",
        mediaClassName,
      )}
    >
      <StatusPill status={status} />
      {!failed ? (
        <Image
          src={imageSrc}
          alt={wallpaper.title}
          fill
          unoptimized={shouldUnoptimizeMedia(imageSrc)}
          className={cn(
            "object-cover",
            loaded ? "opacity-100" : "opacity-0",
            !isPublished && "opacity-80",
          )}
          sizes="(max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-hw-surface px-3 text-center text-xs text-hw-muted">
          Image unavailable
        </div>
      )}
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse bg-hw-surface" />
      )}

      {/* Same as homepage: title on a gradient that fades in */}
      {isPublished && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-3 pb-2.5 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="line-clamp-2 text-[13px] font-medium leading-tight text-white drop-shadow">
            {wallpaper.title}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      {isPublished ? (
        <>
          <Link
            href={`/wallpaper/${wallpaper.slug}`}
            className="relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hw-green/50"
            aria-label={`View ${wallpaper.title}`}
          >
            {media}
          </Link>
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
                "rounded-full bg-black/55 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100",
            )}
            aria-label={
              favorited ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={cn(
                "size-4",
                favorited ? "fill-red-500 text-red-500" : "text-white",
              )}
            />
          </button>
        </>
      ) : (
        <div
          className="relative block cursor-default"
          aria-label={`${wallpaper.title} — ${status}`}
        >
          {media}
        </div>
      )}
    </motion.article>
  );
}
