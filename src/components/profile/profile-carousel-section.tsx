"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProfileCarouselSectionProps {
  title: string;
  seeAllHref?: string | null;
  carouselHeightClass?: string;
  itemGapClass?: string;
  children: React.ReactNode;
  className?: string;
}

/** Figma @ 412px — horizontal wallpaper carousel section */
export function ProfileCarouselSection({
  title,
  seeAllHref = "#",
  carouselHeightClass = "h-[273px]",
  itemGapClass = "gap-1",
  children,
  className,
}: ProfileCarouselSectionProps) {
  return (
    <section className={cn("mx-auto flex w-full max-w-[400px] flex-col gap-[12.511px]", className)}>
      <div className="flex w-full items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[#c8c3bc]">{title}</h2>
        {seeAllHref ? (
          <Link
            href={seeAllHref}
            className="flex items-center gap-[9.53px] text-[13.342px] font-semibold text-[#69a6d5] transition-opacity hover:opacity-80"
          >
            See All
            <Image
              src="/profile/see-all-chevron.svg"
              alt=""
              width={5}
              height={10}
              className="h-[9.53px] w-[4.765px]"
              aria-hidden
            />
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
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[21.268px] bg-gradient-to-r from-[#1d2021] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[21.268px] bg-gradient-to-l from-[#1d2021] to-transparent"
          aria-hidden
        />
      </div>
    </section>
  );
}
