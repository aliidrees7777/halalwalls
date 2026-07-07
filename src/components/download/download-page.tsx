"use client";

import { motion } from "framer-motion";
import { DownloadHeader } from "@/components/download/download-header";
import { DownloadBreadcrumbs } from "@/components/download/download-breadcrumbs";
import { DownloadSidebarLeft } from "@/components/download/download-sidebar-left";
import { DownloadMain } from "@/components/download/download-main";
import { DownloadSidebarRight } from "@/components/download/download-sidebar-right";
import { SiteFooter } from "@/components/layout/site-footer";
import type { Wallpaper, WallpaperDetail } from "@/types/wallpaper";
import { SiteHeader } from "../home/site-header";
import { HomeSidebar } from "../home/home-sidebar";

interface DownloadPageProps {
  wallpaper: WallpaperDetail;
  related: Wallpaper[];
}

export function DownloadPageClient({ wallpaper, related }: DownloadPageProps) {
  return (
    <div className="min-h-screen bg-hw-bg">
      <SiteHeader/>
      {/* <DownloadHeader /> */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="lp-container pt-10 pb-14"
      >
        <header className="text-center">
          <h1 className="text-[22px] font-bold leading-tight text-hw-foreground sm:text-[28px] lg:text-[34.87px]">
            {wallpaper.title}
          </h1>
          <div className="mt-[6px] flex w-full justify-center">
            <DownloadBreadcrumbs wallpaper={wallpaper} />
          </div>
        </header>

        <div className="mt-[46px] flex flex-col gap-[var(--lp-sidebar-gap)] xl:flex-row xl:gap-[var(--lp-main-gap)]">
          <HomeSidebar tags={wallpaper.tags} activeCategory={wallpaper.category} />
          <DownloadMain wallpaper={wallpaper} />

          <DownloadSidebarRight related={related} />
        </div>
      </motion.div>

      <SiteFooter />
    </div>
  );
}
