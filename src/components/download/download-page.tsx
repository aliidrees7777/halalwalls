"use client";

import { motion } from "framer-motion";
import { DownloadHeader } from "@/components/download/download-header";
import { DownloadBreadcrumbs } from "@/components/download/download-breadcrumbs";
import { DownloadSidebarLeft } from "@/components/download/download-sidebar-left";
import { DownloadMain } from "@/components/download/download-main";
import { DownloadSidebarRight } from "@/components/download/download-sidebar-right";
import { SiteFooter } from "@/components/layout/site-footer";
import { getRelatedForDetail } from "@/data/wallpaper-details";
import type { WallpaperDetail } from "@/types/wallpaper";

interface DownloadPageProps {
  wallpaper: WallpaperDetail;
}

export function DownloadPageClient({ wallpaper }: DownloadPageProps) {
  const related = getRelatedForDetail(wallpaper);

  return (
    <div className="min-h-screen bg-hw-bg">
      <DownloadHeader />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6 lg:py-8"
      >
        <header className="mb-6 text-center">
          <h1 className="text-xl font-bold leading-tight text-hw-foreground sm:text-2xl lg:text-[26px]">
            {wallpaper.title}
          </h1>
          <div className="mt-3 flex justify-center">
            <DownloadBreadcrumbs wallpaper={wallpaper} />
          </div>
        </header>

        <div className="flex flex-col gap-4 xl:flex-row xl:gap-5">
          <DownloadSidebarLeft
            activeCategory={wallpaper.category}
            tags={wallpaper.tags}
          />

          <DownloadMain wallpaper={wallpaper} />

          <DownloadSidebarRight related={related} />
        </div>
      </motion.div>

      <SiteFooter />
    </div>
  );
}
