"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { DownloadActions } from "@/components/download/download-actions";
import { DownloadResolutionPanel } from "@/components/download/download-resolution-panel";
import {
  findAvailableResolution,
  normalizeResKey,
} from "@/lib/download-resolution";
import type { DownloadResolution, WallpaperDetail } from "@/types/wallpaper";
import { resolveMediaUrl, shouldUnoptimizeMedia } from "@/lib/media-url";
import { isHttpUrl, parseSourceUrl } from "@/lib/source-url";
import download from "../../../public/download.svg";
import link from "../../../public/link.svg";

interface DownloadMainProps {
  wallpaper: WallpaperDetail;
}

export function DownloadMain({ wallpaper }: DownloadMainProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loaded, setLoaded] = useState(false);
  const imageSrc = resolveMediaUrl(wallpaper.image);

  const urlResolution = searchParams.get("resolution");
  const browseMatch = useMemo(
    () => findAvailableResolution(wallpaper, urlResolution),
    [wallpaper, urlResolution],
  );

  // Highlight browse choice when valid; otherwise the wallpaper's preferred size.
  const selectedResolution =
    browseMatch?.label.replace(/×/g, "x") ??
    (wallpaper.preferredResolution
      ? normalizeResKey(wallpaper.preferredResolution)
      : null);

  const sourceParsed = parseSourceUrl(wallpaper.description);
  const sourceUrl =
    sourceParsed.url && isHttpUrl(sourceParsed.url) ? sourceParsed.url : null;
  const sourceLabel =
    sourceParsed.username ||
    (wallpaper.author && wallpaper.author !== "HalalWalls"
      ? wallpaper.author
      : null);

  const setResolutionQuery = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("resolution", normalizeResKey(key));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Resolution chips only select — download happens via the main button.
  const handleResolutionSelect = (res: DownloadResolution) => {
    setResolutionQuery(res.label);
  };

  return (
    <div className="min-w-0 flex-1 xl:max-w-[921px]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-[7px] border border-hw-line bg-hw-deep"
      >
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.35 }}
          className="relative aspect-[16/9] w-full"
        >
          <Image
            src={imageSrc}
            alt={wallpaper.title}
            fill
            priority
            unoptimized={shouldUnoptimizeMedia(imageSrc)}
            className={`object-cover transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 1024px) 100vw, 720px"
            onLoad={() => setLoaded(true)}
          />
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-hw-surface" />
          )}
        </motion.div>
      </motion.div>
      <div className="mt-4 flex">
        <Badge
          variant="outline"
          className="mr-3 h-[26px] w-[74px] gap-2 rounded-full border-hw-line bg-hw-down text-[15px] font-semibold text-[#ffffff]"
        >
          <Image src={download} alt="download" />
          {(wallpaper.downloadCount ?? 0).toLocaleString()}
        </Badge>
        <div className="flex flex-wrap items-center">
          <Image src={link} alt="link" className="mr-2" />
          {wallpaper.tags.map((tag, index) => (
            <Link
              key={`${tag}-${index}`}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className="text-[19px] font-medium text-hw-foreground underline decoration-hw-foreground/50 underline-offset-2 transition-colors hover:text-hw-green hover:decoration-hw-green/50"
            >
              {tag}
              {index < wallpaper.tags.length - 1 ? "," : ""}
              {index < wallpaper.tags.length - 1 ? "\u00A0" : ""}
            </Link>
          ))}
        </div>
      </div>
      <p className="ml-21 mt-3 text-[17px] leading-relaxed text-hw-muted">
        — Published on {wallpaper.publishedAt} | Original Resolution:{" "}
        {wallpaper.originalResolution} |{" "}
        {sourceUrl && sourceLabel ? (
          <>
            Source:{" "}
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-hw-foreground underline decoration-hw-foreground/50 underline-offset-2 transition-colors hover:text-hw-green hover:decoration-hw-green/50"
            >
              {sourceLabel}
            </a>
          </>
        ) : (
          <>Author: {wallpaper.author}</>
        )}
      </p>

      <div className="mt-5">
        <DownloadActions
          wallpaper={wallpaper}
          selectedResolution={selectedResolution}
          onSelectedResolutionChange={setResolutionQuery}
        />
      </div>

      <div className="mt-5">
        <DownloadResolutionPanel
          wallpaper={wallpaper}
          selectedResolution={selectedResolution}
          onSelect={handleResolutionSelect}
        />
      </div>
    </div>
  );
}
