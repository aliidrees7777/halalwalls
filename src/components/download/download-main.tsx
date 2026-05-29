"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { DownloadActions } from "@/components/download/download-actions";
import { DownloadResolutionPanel } from "@/components/download/download-resolution-panel";
import type { DownloadResolution, WallpaperDetail } from "@/types/wallpaper";

interface DownloadMainProps {
  wallpaper: WallpaperDetail;
}

export function DownloadMain({ wallpaper }: DownloadMainProps) {
  const [loaded, setLoaded] = useState(false);
  const [lastDownload, setLastDownload] = useState<string | null>(null);

  const handleResolution = (res: DownloadResolution) => {
    setLastDownload(`${res.label} · ${res.fileSizeMB.toFixed(2)} MB`);
    setTimeout(() => setLastDownload(null), 2500);
  };

  return (
    <div className="min-w-0 flex-1">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-lg border border-[#2a2f2d] bg-[#0d0f0e]"
      >
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.35 }}
          className="relative aspect-[16/9] w-full"
        >
          <Image
            src={wallpaper.image}
            alt={wallpaper.title}
            fill
            priority
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

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge
          variant="outline"
          className="gap-1.5 rounded-md border-[#3a3f3d] bg-[#121412] px-2.5 py-1 text-[12px] font-normal text-hw-muted"
        >
          <Download className="size-3.5" />
          {wallpaper.views.toLocaleString()}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {wallpaper.tagSlugs.map((slug, index) => (
          <Link
            key={slug}
            href="#"
            className="text-[12px] text-hw-muted underline decoration-hw-muted/40 underline-offset-2 transition-colors hover:text-hw-green hover:decoration-hw-green/50"
          >
            #{slug}
          </Link>
        ))}
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-hw-muted">
        — Published on {wallpaper.publishedAt} | Original Resolution:{" "}
        {wallpaper.originalResolution} | Author: {wallpaper.author}
      </p>

      <div className="mt-5">
        <DownloadActions wallpaper={wallpaper} />
      </div>

      {lastDownload && (
        <p className="mt-2 text-[12px] text-hw-green" role="status">
          Prepared download: {lastDownload}
        </p>
      )}

      <div className="mt-5">
        <DownloadResolutionPanel onSelect={handleResolution} />
      </div>
    </div>
  );
}
