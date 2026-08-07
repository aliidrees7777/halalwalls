"use client";

import { useMemo, useState } from "react";
import { Check, Heart, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavorite } from "@/hooks/use-favorite";
import { useWallpaperDownload } from "@/hooks/use-wallpaper-download";
import { findAvailableResolution } from "@/lib/download-resolution";
import type { WallpaperDetail } from "@/types/wallpaper";
import Image from "next/image";
import downloadrotate from "../../../public/detail-page/downloadrotate.svg";

/** Textured fill stays fixed — white label/icon always; hover adds a light wash only. */
const downloadBtnClass =
  "relative h-[42.67px] overflow-hidden rounded-[8px] border-2 border-[#33373A] bg-black bg-[url('/detail-page/download-btn-bg.jpg')] bg-cover bg-center px-[17.78px] text-[17px] font-medium text-white shadow-none transition-colors hover:bg-black hover:text-white hover:brightness-100 disabled:opacity-70 sm:w-auto dark:border-hw-line dark:bg-black dark:text-white dark:hover:bg-black dark:hover:text-white before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-transparent before:transition-colors hover:before:bg-white/15 [&_img]:relative [&_img]:z-[1] [&_svg]:relative [&_svg]:z-[1] [&_span]:relative [&_span]:z-[1]";

interface DownloadActionsProps {
  wallpaper: WallpaperDetail;
  /** Browse resolution from homepage (`?resolution=`), when available for this wallpaper. */
  selectedResolution?: string | null;
  onSelectedResolutionChange?: (resolution: string) => void;
}

export function DownloadActions({
  wallpaper,
  selectedResolution,
  onSelectedResolutionChange,
}: DownloadActionsProps) {
  const { download, locked } = useWallpaperDownload(wallpaper);
  const {
    isFavorite: favorited,
    count: favCount,
    toggle: toggleFav,
  } = useFavorite(wallpaper.id, wallpaper.favoritesCount ?? 0);
  const [primaryDone, setPrimaryDone] = useState(false);
  const [originalDone, setOriginalDone] = useState(false);
  const [busy, setBusy] = useState<"primary" | "original" | null>(null);

  const browseMatch = useMemo(
    () => findAvailableResolution(wallpaper, selectedResolution),
    [wallpaper, selectedResolution],
  );

  const primaryKey =
    browseMatch?.label.replace(/×/g, "x") ?? wallpaper.preferredResolution;
  // Browse filter → show exact size (e.g. 2560×1440); otherwise friendly 4K/2K/Full HD.
  const primaryLabel = browseMatch
    ? browseMatch.label
    : wallpaper.preferredResolutionLabel || wallpaper.preferredResolution;

  const flashDone = (type: "primary" | "original") => {
    if (type === "primary") setPrimaryDone(true);
    else setOriginalDone(true);
    setTimeout(() => {
      if (type === "primary") setPrimaryDone(false);
      else setOriginalDone(false);
    }, 2200);
  };

  const handleDownload = async (
    type: "primary" | "original",
    resolution: string,
  ) => {
    if (busy || locked) {
      await download(resolution);
      return;
    }
    setBusy(type);
    try {
      const ok = await download(resolution);
      if (ok) flashDone(type);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-[14px]">
      <Button
        type="button"
        disabled={busy !== null}
        onClick={() => {
          if (browseMatch) {
            onSelectedResolutionChange?.(
              browseMatch.label.replace(/×/g, "x"),
            );
          }
          handleDownload("primary", primaryKey);
        }}
        className={downloadBtnClass}
      >
        {busy === "primary" ? (
          <Loader2 className="relative z-[1] mr-2 size-4 animate-spin" aria-hidden />
        ) : primaryDone ? (
          <Check className="relative z-[1] mr-2 size-4 text-hw-green" />
        ) : locked ? (
          <Lock className="relative z-[1] mr-2 size-4 text-hw-yellow" />
        ) : (
          <Image
            src={downloadrotate}
            alt=""
            width={17}
            height={16}
            className="relative z-[1] mr-2 size-[17px] shrink-0"
            aria-hidden
          />
        )}
        <span className="relative z-[1]">
          {busy === "primary"
            ? "Downloading…"
            : locked
              ? "Premium — Go Premium to Download"
              : `Download Wallpaper (${primaryLabel})`}
        </span>
      </Button>

      <Button
        type="button"
        disabled={busy !== null}
        onClick={() => handleDownload("original", "original")}
        className={downloadBtnClass}
      >
        {busy === "original" ? (
          <Loader2 className="relative z-[1] mr-2 size-4 animate-spin" aria-hidden />
        ) : originalDone ? (
          <Check className="relative z-[1] mr-2 size-4 text-hw-green" />
        ) : locked ? (
          <Lock className="relative z-[1] mr-2 size-4 text-hw-yellow" />
        ) : (
          <Image
            src={downloadrotate}
            alt=""
            width={17}
            height={16}
            className="relative z-[1] mr-2 size-[17px] shrink-0"
            aria-hidden
          />
        )}
        <span className="relative z-[1]">
          {busy === "original"
            ? "Downloading…"
            : locked
              ? "Premium Only"
              : `Download Original (${wallpaper.originalSizeMB.toFixed(2)}MB)`}
        </span>
      </Button>

      <Button
        type="button"
        onClick={toggleFav}
        className={cn(
          downloadBtnClass,
          "w-full sm:w-auto",
          favorited && "border-red-500/40 text-red-400 hover:text-red-400",
        )}
      >
        <Heart
          className={cn(
            "relative z-[1] mr-2 size-4",
            favorited && "fill-red-500 text-red-500",
          )}
        />
        <span className="relative z-[1]">
          {favorited ? "Favorited" : "Favorite"}
          {favCount > 0 && (
            <span className="ml-1.5 text-white/70">· {favCount}</span>
          )}
        </span>
      </Button>
    </div>
  );
}
