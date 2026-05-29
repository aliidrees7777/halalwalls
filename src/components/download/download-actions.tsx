"use client";

import { useState } from "react";
import { Check, Download, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WallpaperDetail } from "@/types/wallpaper";

interface DownloadActionsProps {
  wallpaper: WallpaperDetail;
  onResolutionSelect?: (resolution: string) => void;
}

export function DownloadActions({ wallpaper }: DownloadActionsProps) {
  const [favorited, setFavorited] = useState(wallpaper.isFavorite ?? false);
  const [primaryDone, setPrimaryDone] = useState(false);
  const [originalDone, setOriginalDone] = useState(false);

  const handleMockDownload = (type: "primary" | "original") => {
    if (type === "primary") setPrimaryDone(true);
    else setOriginalDone(true);
    setTimeout(() => {
      if (type === "primary") setPrimaryDone(false);
      else setOriginalDone(false);
    }, 2200);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Button
        type="button"
        onClick={() => handleMockDownload("primary")}
        className="h-10 flex-1 rounded-md border border-[#3a3f3d] bg-[#1a1d1c] px-4 text-[13px] font-medium text-hw-foreground shadow-none transition-colors hover:border-hw-green/35 hover:bg-[#222625] sm:min-w-[240px] sm:flex-[1.4]"
      >
        {primaryDone ? (
          <Check className="mr-2 size-4 text-hw-green" />
        ) : (
          <Download className="mr-2 size-4" />
        )}
        Download Wallpaper ({wallpaper.preferredResolution})
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => handleMockDownload("original")}
        className="h-10 flex-1 rounded-md border-[#3a3f3d] bg-[#121412] px-4 text-[13px] font-medium text-hw-foreground shadow-none transition-colors hover:border-hw-muted hover:bg-[#1a1d1c] sm:min-w-[200px]"
      >
        {originalDone ? (
          <Check className="mr-2 size-4 text-hw-green" />
        ) : (
          <Download className="mr-2 size-4" />
        )}
        Download Original ({wallpaper.originalSizeMB.toFixed(2)}MB)
      </Button>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setFavorited((v) => !v)}
          className={cn(
            "h-10 w-full rounded-md border-[#3a3f3d] bg-[#121412] px-6 text-[13px] font-medium shadow-none transition-colors sm:w-auto",
            favorited && "border-red-500/40 text-red-400"
          )}
        >
          <Heart
            className={cn(
              "mr-2 size-4",
              favorited && "fill-red-500 text-red-500"
            )}
          />
          Favorite
        </Button>
      </motion.div>
    </div>
  );
}
