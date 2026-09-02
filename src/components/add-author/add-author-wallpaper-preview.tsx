"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddAuthorWallpaperPreviewProps {
  title: string;
  imageSrc: string;
  href?: string;
  className?: string;
}

/** Right-column wallpaper preview — Figma node 1939:14104. */
export function AddAuthorWallpaperPreview({
  title,
  imageSrc,
  href = "#",
  className,
}: AddAuthorWallpaperPreviewProps) {
  return (
    <div
      className={cn(
        "relative w-full shrink-0 lg:w-[734px]",
        className,
      )}
    >
      <div className="relative aspect-[734/413] w-full overflow-hidden rounded-[14px]">
        <Image
          src={imageSrc}
          alt={title}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 1023px) 100vw, 734px"
          priority
        />
        <div
          className="absolute inset-0 rounded-[14px] bg-black/30"
          aria-hidden
        />
        <Link
          href={href}
          className="absolute left-1/2 top-1/2 flex max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-[5px] bg-black/60 px-4 py-2.5 text-white transition-colors hover:bg-black/70"
        >
          <span className="truncate text-base font-normal leading-normal lg:text-[21.401px]">
            &lsquo;{title}&rsquo;
          </span>
          <ExternalLink
            className="size-[18.889px] shrink-0"
            aria-hidden
            strokeWidth={2}
          />
        </Link>
      </div>
    </div>
  );
}
