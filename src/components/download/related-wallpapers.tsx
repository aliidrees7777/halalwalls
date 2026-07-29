"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Wallpaper } from "@/types/wallpaper";
import { resolveMediaUrl, shouldUnoptimizeMedia } from "@/lib/media-url";
import { cn } from "@/lib/utils";

interface RelatedWallpapersProps {
  items: Wallpaper[];
}

const titleClass =
  "flex h-[49.7px] items-center justify-center text-[length:var(--lp-panel-title)] font-bold leading-[22px] text-hw-foreground bg-hw-sidebar";

function WallpaperThumb({
  wallpaper,
  className,
}: {
  wallpaper: Wallpaper;
  className?: string;
}) {
  const src = resolveMediaUrl(wallpaper.image);
  return (
    <Link
      href={`/wallpaper/${wallpaper.slug}`}
      className={cn(
        "relative block aspect-video w-full overflow-hidden bg-hw-deep",
        className,
      )}
    >
      <Image
        src={src}
        alt={wallpaper.title}
        fill
        unoptimized={shouldUnoptimizeMedia(src)}
        className="object-cover transition-opacity duration-300 hover:opacity-90"
        sizes="418px"
      />
    </Link>
  );
}

export function RelatedWallpapers({ items }: RelatedWallpapersProps) {
  const related = items.slice(0, 5);
  const [first, ...rest] = related;

  if (!first) {
    return (
      <section>
        <h2
          className={cn(
            titleClass,
            "rounded-[var(--lp-panel-radius)] border-[length:var(--lp-panel-border)] border-hw-line",
          )}
        >
          Related Content
        </h2>
        <p className="py-6 text-center text-[length:var(--lp-panel-item)] text-hw-muted">
          No related wallpapers yet.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-1">
      {/* Title + first wallpaper share one outer border; single divider between them */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-[var(--lp-panel-radius)] border-[length:var(--lp-panel-border)] border-hw-line"
      >
        <h2 className={cn(titleClass, "border-b-[length:var(--lp-panel-border)] border-hw-line")}>
          Related Content
        </h2>
        <WallpaperThumb wallpaper={first} />
      </motion.div>

      {rest.map((wallpaper, index) => (
        <motion.div
          key={wallpaper.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * (index + 1), duration: 0.35 }}
        >
          <WallpaperThumb
            wallpaper={wallpaper}
            className="rounded-[var(--lp-card-radius)] border border-hw-line"
          />
        </motion.div>
      ))}
    </section>
  );
}
