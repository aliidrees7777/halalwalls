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

/** Textured fill stays fixed — white label/icon always; hover adds a light wash only.
 *  Mobile: full-width × 52px, 12.44px radius. Desktop sizes unchanged from lg up. */
const downloadBtnClass =
  "relative box-border flex h-[52px] w-full items-center justify-center gap-[5.33px] overflow-hidden rounded-[12.4444px] border-2 border-[#3A3E41] bg-black bg-[url('/detail-page/download-btn-bg.jpg')] bg-cover bg-center px-[17.78px] text-[17.78px] font-medium leading-[22px] text-[#D8D5D1] shadow-none transition-colors hover:bg-black hover:text-[#D8D5D1] hover:brightness-100 disabled:opacity-70 lg:h-[42.67px] lg:w-auto lg:gap-0 lg:rounded-[8px] lg:border-[#33373A] lg:px-[17.78px] lg:text-[17px] lg:leading-normal lg:text-white lg:hover:text-white dark:border-[#3A3E41] dark:bg-black dark:text-[#D8D5D1] dark:hover:bg-black dark:hover:text-[#D8D5D1] lg:dark:border-hw-line lg:dark:text-white lg:dark:hover:text-white before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-transparent before:transition-colors hover:before:bg-white/15 [&_img]:relative [&_img]:z-[1] [&_svg]:relative [&_svg]:z-[1] [&_span]:relative [&_span]:z-[1]";

const downloadIconClass =
  "relative z-[1] h-4 w-[16.22px] shrink-0 lg:mr-2 lg:size-[17px] lg:w-[17px]";

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
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:gap-[14px]">
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
          <Loader2 className={cn(downloadIconClass, "animate-spin")} aria-hidden />
        ) : primaryDone ? (
          <Check className={cn(downloadIconClass, "text-hw-green")} />
        ) : locked ? (
          <Lock className={cn(downloadIconClass, "text-hw-yellow")} />
        ) : (
          <Image
            src={downloadrotate}
            alt=""
            width={16}
            height={16}
            className={downloadIconClass}
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
          <Loader2 className={cn(downloadIconClass, "animate-spin")} aria-hidden />
        ) : originalDone ? (
          <Check className={cn(downloadIconClass, "text-hw-green")} />
        ) : locked ? (
          <Lock className={cn(downloadIconClass, "text-hw-yellow")} />
        ) : (
          <Image
            src={downloadrotate}
            alt=""
            width={16}
            height={16}
            className={downloadIconClass}
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
          favorited && "border-red-500/40 text-red-400 hover:text-red-400",
        )}
      >
        <Heart
          className={cn(
            downloadIconClass,
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
