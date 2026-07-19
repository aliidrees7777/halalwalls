"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Wallpaper } from "@/types/wallpaper";
import { cn } from "@/lib/utils";
import { resolveMediaUrl, shouldUnoptimizeMedia } from "@/lib/media-url";

type UploadStatus = "active" | "pending" | "hidden";

interface ProfileCarouselThumbProps {
  wallpaper: Wallpaper & { status?: UploadStatus };
  className?: string;
}

function StatusPill({ status }: { status?: UploadStatus }) {
  if (!status || status === "active") return null;
  const isPending = status === "pending";
  return (
    <span
      className={cn(
        "absolute left-1 top-1 z-10 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
        isPending
          ? "bg-[#2F2805] text-[#E8B84A]"
          : "bg-[#1a1a1a] text-[#ef4444]",
      )}
    >
      {isPending ? "Pending" : "Rejected"}
    </span>
  );
}

/** Figma carousel card — 124.2px wide, portrait, 0.634px border */
export function ProfileCarouselThumb({
  wallpaper,
  className,
}: ProfileCarouselThumbProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageSrc = resolveMediaUrl(wallpaper.image);
  const status = wallpaper.status;
  const isPublished = !status || status === "active";

  const media = (
    <>
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
    </>
  );

  const shellClass = cn(
    "relative h-full w-[124.2px] shrink-0 overflow-hidden rounded-[3.802px] border-[0.634px] border-[#5b6268] bg-hw-card",
    className,
  );

  if (!isPublished) {
    return (
      <div
        className={shellClass}
        aria-label={`${wallpaper.title} — ${status}`}
      >
        {media}
      </div>
    );
  }

  return (
    <Link
      href={`/wallpaper/${wallpaper.slug}`}
      className={shellClass}
      aria-label={`View ${wallpaper.title}`}
    >
      {media}
    </Link>
  );
}
