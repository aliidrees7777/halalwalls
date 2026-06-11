"use client";

import { useState } from "react";
import { Check, Download, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { useFavorite } from "@/hooks/use-favorite";
import type { WallpaperDetail } from "@/types/wallpaper";

interface DownloadActionsProps {
  wallpaper: WallpaperDetail;
  onResolutionSelect?: (resolution: string) => void;
}

export function DownloadActions({ wallpaper }: DownloadActionsProps) {
  const { isAuthenticated, openAuthModal } = useAuth();
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
    if (!isAuthenticated) {
      openAuthModal("signin");
      return;
    }

    try {
      const data = await api.post<{
        url: string;
        downloadCount: number;
        resolution: string;
      }>(`/wallpapers/${wallpaper.slug}/download`, { resolution });
      window.open(data.url, "_blank", "noopener");
      flashDone(type);
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 401) {
        openAuthModal("signin");
        return;
      }
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Button
        type="button"
        onClick={() => handleDownload("primary", wallpaper.preferredResolution)}
        className="h-10 flex-1 rounded-md border border-hw-line bg-hw-pill2 px-4 text-[13px] font-medium text-hw-foreground shadow-none transition-colors hover:border-hw-green/35 hover:bg-hw-pill2-hover sm:min-w-[240px] sm:flex-[1.4]"
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
        onClick={() =>
          handleDownload("original", wallpaper.originalResolution)
        }
        className="h-10 flex-1 rounded-md border-hw-line bg-hw-deep px-4 text-[13px] font-medium text-hw-foreground shadow-none transition-colors hover:border-hw-muted hover:bg-hw-pill2 sm:min-w-[200px]"
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
          onClick={toggleFav}
          className={cn(
            "h-10 w-full rounded-md border-hw-line bg-hw-deep px-6 text-[13px] font-medium shadow-none transition-colors sm:w-auto",
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
