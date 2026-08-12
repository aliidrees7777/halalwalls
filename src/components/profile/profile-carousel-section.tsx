"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCarouselSectionProps {
  title: string;
  seeAllHref?: string | null;
  carouselHeightClass?: string;
  itemGapClass?: string;
  /** Figma light: edge fades shown on Uploads; hidden on Discover / Favorites. */
  showEdgeFade?: boolean;
  children: React.ReactNode;
  className?: string;
}

/** Figma @ 412px — horizontal wallpaper carousel section (light + dark) */
export function ProfileCarouselSection({
  title,
  seeAllHref = "#",
  carouselHeightClass = "h-[272px]",
  itemGapClass = "gap-1",
  showEdgeFade = false,
  children,
  className,
}: ProfileCarouselSectionProps) {
  return (
    <section className={cn("mx-auto flex w-full max-w-[400px] flex-col gap-[12.51px]", className)}>
      <div className="flex w-full items-center justify-between gap-[6.26px]">
        <h2 className="text-[16px] font-semibold leading-[19px] text-black dark:text-[#c8c3bc]">
          {title}
        </h2>
        {seeAllHref ? (
          <Link
            href={seeAllHref}
            className="flex items-center gap-[9.53px] text-[13.342px] font-semibold leading-4 text-[#0090FF] transition-opacity hover:opacity-80 dark:text-[#69a6d5]"
          >
            See All
            <ChevronRight className="size-[10px] shrink-0" strokeWidth={2.5} aria-hidden />
          </Link>
        ) : null}
      </div>

      <div className={cn("relative w-full overflow-hidden", carouselHeightClass)}>
        <div
          className={cn(
            "flex h-full items-stretch overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            itemGapClass,
          )}
        >
          {children}
        </div>
        {showEdgeFade ? (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[21.27px] bg-gradient-to-r from-white to-transparent dark:from-[#1d2021]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-[21.27px] bg-gradient-to-l from-white to-transparent dark:from-[#1d2021]"
              aria-hidden
            />
          </>
        ) : null}
      </div>
    </section>
  );
}
