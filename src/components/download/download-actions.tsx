"use client";

import { useState } from "react";
import { Check, Heart, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavorite } from "@/hooks/use-favorite";
import { useWallpaperDownload } from "@/hooks/use-wallpaper-download";
import type { WallpaperDetail } from "@/types/wallpaper";
import Image from "next/image";
import downloadrotate from "../../../public/detail-page/downloadrotate.svg"
interface DownloadActionsProps {
  wallpaper: WallpaperDetail;
}

export function DownloadActions({ wallpaper }: DownloadActionsProps) {
  const { download, locked } = useWallpaperDownload(wallpaper);
  const { isFavorite: favorited, count: favCount, toggle: toggleFav } = useFavorite(
    wallpaper.id,
    wallpaper.favoritesCount ?? 0
  );
  const [primaryDone, setPrimaryDone] = useState(false);
  const [originalDone, setOriginalDone] = useState(false);

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
    resolution: string
  ) => {
    const ok = await download(resolution);
    if (ok) flashDone(type);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-[14px]">
      <Button
        type="button"
        onClick={() => handleDownload("primary", wallpaper.preferredResolution)}
        className="h-[42.67px] rounded-[8px] border-2 border-hw-line bg-hw-deep px-[17.78px] text-[17px] font-medium text-hw-down-text shadow-none transition-colors hover:bg-hw-pill2-hover sm:w-auto"
      >
        {primaryDone ? (
          <Check className="mr-2 size-4 text-hw-green" />
        ) : locked ? (
          <Lock className="mr-2 size-4 text-hw-yellow" />
        ) : (
          <Image src={downloadrotate} alt="downloadrotate"/>
        )}
        {locked
          ? "Premium — Go Premium to Download"
          : `Download Wallpaper (${wallpaper.preferredResolution})`}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => handleDownload("original", "original")}
        className="h-[42.67px] rounded-[8px] border-2 border-hw-line bg-hw-deep px-[17.78px] text-[17px] font-medium text-hw-down-text shadow-none transition-colors hover:border-hw-muted hover:bg-hw-pill2 sm:w-auto"
      >
        {originalDone ? (
          <Check className="mr-2 size-4 text-hw-green" />
        ) : locked ? (
          <Lock className="mr-2 size-4 text-hw-yellow" />
        ) : (
         <Image src={downloadrotate} alt="downloadrotate"/>
        )}
        {locked
          ? "Premium Only"
          : `Download Original (${wallpaper.originalSizeMB.toFixed(2)}MB)`}
      </Button>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="button"
          variant="outline"
          onClick={toggleFav}
          className={cn(
            "h-[42.67px] w-full rounded-[8px] border-2 text-hw-down-text border-hw-line bg-hw-deep px-[17.78px] text-[17px] font-medium shadow-none transition-colors sm:w-auto",
            favorited && "border-red-500/40 text-red-400"
          )}
        >
          <Heart
            className={cn(
              "mr-2 size-4",
              favorited && "fill-red-500 text-red-500"
            )}
          />
          {favorited ? "Favorited" : "Favorite"}
          {favCount > 0 && <span className="ml-1.5 text-hw-muted">· {favCount}</span>}
        </Button>
      </motion.div>
    </div>
  );
}
