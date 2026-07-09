"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Wallpaper } from "@/types/wallpaper";
import { cn } from "@/lib/utils";
import { resolveMediaUrl, shouldUnoptimizeMedia } from "@/lib/media-url";

interface ProfileWallpaperThumbProps {
  wallpaper: Wallpaper;
  index?: number;
}

export function ProfileWallpaperThumb({
  wallpaper,
  index = 0,
}: ProfileWallpaperThumbProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageSrc = resolveMediaUrl(wallpaper.image);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-md"
    >
      <Link
        href={`/wallpaper/${wallpaper.slug}`}
        className="relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hw-green/50"
        aria-label={`View ${wallpaper.title}`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-hw-card">
          {!failed ? (
            <Image
              src={imageSrc}
              alt={wallpaper.title}
              fill
              unoptimized={shouldUnoptimizeMedia(imageSrc)}
              className={cn(
                "object-cover transition-transform duration-500 group-hover:scale-[1.04]",
                loaded ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
        </div>
      </Link>
    </motion.article>
  );
}
