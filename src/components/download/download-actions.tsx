"use client";

import { Heart, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavorite } from "@/hooks/use-favorite";
import {
  useWallpaperDownload,
  normalizeResolution,
} from "@/hooks/use-wallpaper-download";
import type { WallpaperDetail } from "@/types/wallpaper";
import Image from "next/image";
import downloadrotate from "../../../public/detail-page/downloadrotate.svg";

interface DownloadActionsProps {
  wallpaper: WallpaperDetail;
}

function Spinner() {
  return (
    <span className="mr-2 size-4 shrink-0 animate-spin rounded-full border-2 border-hw-down-text/30 border-t-hw-down-text" />
  );
}

export function DownloadActions({ wallpaper }: DownloadActionsProps) {
  const { isFavorite: favorited, count: favCount, toggle: toggleFav } = useFavorite(
    wallpaper.id,
    wallpaper.favoritesCount ?? 0,
  );
  const { download, downloading, locked, error } = useWallpaperDownload(wallpaper);

  const primaryKey = normalizeResolution(wallpaper.preferredResolution);
  const primaryBusy = downloading === primaryKey;
  const originalBusy = downloading === "original";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {/* Primary — the preferred resolution */}
        <Button
          type="button"
          onClick={() => download(wallpaper.preferredResolution)}
          disabled={downloading !== null}
          className="lg:h-10 py-2 flex-1 rounded-md border-2 border-hw-line bg-hw-deep px-4 text-[17px] font-medium text-hw-down-text shadow-none transition-colors hover:bg-hw-pill2-hover disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[240px] sm:flex-[1.4]"
        >
          {primaryBusy ? (
            <Spinner />
          ) : locked ? (
            <Lock className="mr-2 size-4 text-hw-yellow" />
          ) : (
            <Image src={downloadrotate} alt="" />
          )}
          {primaryBusy
            ? "Preparing…"
            : locked
              ? "Premium — Go Premium to Download"
              : `Download Wallpaper (${wallpaper.preferredResolution})`}
        </Button>

        {/* Original size */}
        <Button
          type="button"
          variant="outline"
          onClick={() => download("original")}
          disabled={downloading !== null}
          className="lg:h-10 py-2 flex-1 rounded-md border-2 border-hw-line bg-hw-deep px-4 text-[17px] font-medium text-hw-down-text shadow-none transition-colors hover:border-hw-muted hover:bg-hw-pill2 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[290px]"
        >
          {originalBusy ? (
            <Spinner />
          ) : locked ? (
            <Lock className="mr-2 size-4 text-hw-yellow" />
          ) : (
            <Image src={downloadrotate} alt="" />
          )}
          {originalBusy
            ? "Preparing…"
            : locked
              ? "Premium Only"
              : `Download Original (${wallpaper.originalSizeMB.toFixed(2)}MB)`}
        </Button>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="button"
            variant="outline"
            onClick={toggleFav}
            className={cn(
              "lg:h-10 py-5 w-full rounded-md border-2 text-hw-down-text border-hw-line bg-hw-deep px-6 text-[17px] font-medium shadow-none transition-colors sm:w-auto",
              favorited && "border-red-500/40 text-red-400",
            )}
          >
            <Heart
              className={cn("mr-2 size-4", favorited && "fill-red-500 text-red-500")}
            />
            {favorited ? "Favorited" : "Favorite"}
            {favCount > 0 && <span className="ml-1.5 text-hw-muted">· {favCount}</span>}
          </Button>
        </motion.div>
      </div>

      {error && (
        <p role="alert" className="text-[13px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
