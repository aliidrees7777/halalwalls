"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Wallpaper } from "@/types/wallpaper";
import { useDevicePreviewSrc } from "@/hooks/use-device-preview-src";
import { shouldUnoptimizeMedia } from "@/lib/media-url";
import { cn } from "@/lib/utils";

interface RelatedWallpapersProps {
  items: Wallpaper[];
}

const titleClass =
  "flex h-[49.7px] items-center justify-center text-[length:var(--lp-panel-title)] font-bold leading-[22px] text-hw-foreground bg-hw-sidebar";

const mobileThumbClass =
  "aspect-[181/416] w-full rounded-[5.81988px] border-[0.969979px] border-solid border-[#5B6268]";

function WallpaperThumb({
  wallpaper,
  className,
  sizes = "418px",
}: {
  wallpaper: Wallpaper;
  className?: string;
  sizes?: string;
}) {
  const src = useDevicePreviewSrc(wallpaper.image, wallpaper.mobileImage);
  return (
    <Link
      href={`/wallpaper/${wallpaper.slug}`}
      className={cn(
        "group relative block overflow-hidden bg-hw-deep",
        className,
      )}
    >
      <Image
        src={src}
        alt={wallpaper.title}
        fill
        unoptimized={shouldUnoptimizeMedia(src)}
        className="object-cover transition-opacity duration-300 group-hover:opacity-90"
        sizes={sizes}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-3 pb-2.5 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="line-clamp-2 text-[13px] font-medium leading-tight text-white drop-shadow">
          {wallpaper.title}
        </p>
      </div>
    </Link>
  );
}

export function RelatedWallpapers({ items }: RelatedWallpapersProps) {
  const mobileItems = items.slice(0, 6);
  const desktopRelated = items.slice(0, 5);
  const [first, ...rest] = desktopRelated;

  if (!first && mobileItems.length === 0) {
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
    <>
      {/* Mobile — 2-up portrait grid (Figma carousel) */}
      <section className="mx-auto flex w-[384px] max-w-full flex-col items-center gap-[6px] rounded-[6px] border-2 border-hw-line bg-hw-sidebar pb-[6px] lg:hidden dark:border-[#3A3E41] dark:bg-[#222426]">
        <h2 className={cn(titleClass, "w-full rounded-t-[4px] border-b-2 border-hw-line dark:border-[#3A3E41]")}>
          Related Content
        </h2>
        <div className="grid w-full grid-cols-2 gap-x-[6px] gap-y-[6px] bg-hw-sidebar px-[6px] dark:bg-[#222426]">
          {mobileItems.map((wallpaper, index) => (
            <motion.div
              key={wallpaper.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * index, duration: 0.35 }}
              className="min-w-0 w-full"
            >
              <WallpaperThumb
                wallpaper={wallpaper}
                className={mobileThumbClass}
                sizes="(max-width: 1023px) 45vw, 181px"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Desktop — title + featured, then stacked list */}
      {first ? (
        <section className="hidden flex-col gap-1 lg:flex">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-[var(--lp-panel-radius)] border-[length:var(--lp-panel-border)] border-hw-line"
          >
            <h2
              className={cn(
                titleClass,
                "border-b-[length:var(--lp-panel-border)] border-hw-line",
              )}
            >
              Related Content
            </h2>
            <WallpaperThumb
              wallpaper={first}
              className="aspect-video w-full"
            />
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
                className="aspect-video w-full rounded-[var(--lp-card-radius)] border border-hw-line"
              />
            </motion.div>
          ))}
        </section>
      ) : null}
    </>
  );
}
