"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { RelatedWallpapers } from "@/components/download/related-wallpapers";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import type { Wallpaper } from "@/types/wallpaper";

interface DownloadSidebarRightProps {
  related: Wallpaper[];
}

function GooglePlayButton({ className }: { className?: string }) {
  return (
    <a
      href="https://play.google.com/store/apps"
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "flex w-full max-w-[200px] items-center justify-center gap-2.5 rounded-md border border-hw-line bg-hw-play px-3 py-2.5 transition-opacity hover:opacity-90"
      }
    >
      <Image
        src="/google-logo.svg"
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0 object-contain"
      />
      <div className="leading-tight">
        <p className="text-[11px] font-semibold text-hw-foreground/60">
          Get it on
        </p>
        <p className="text-[15px] font-semibold text-hw-foreground">
          Google Play
        </p>
      </div>
    </a>
  );
}

function OurAppContent() {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-5 sm:gap-4 sm:px-5">
      <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
        {/* Native <img> for SVGs — next/image often breaks local SVG (optimizer/CSP). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/detail-page/our-app-logo.svg"
          alt="HalalWalls app"
          width={112}
          height={112}
          className="size-[88px] rounded-[14px] object-cover sm:size-[100px] sm:rounded-2xl"
        />
        <p className="text-center text-[20px] font-bold leading-none tracking-tight sm:text-[22px]">
          <span className="text-hw-foreground">Halal</span>
          <span className="text-hw-green">Walls</span>
        </p>
        <GooglePlayButton />
        <p className="text-center text-[15px] font-medium text-hw-foreground sm:text-[16px]">
          Coming Soon...
        </p>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/detail-page/our-app-phone.svg"
        alt="HalalWalls mobile app preview"
        width={156}
        height={322}
        className="h-[240px] w-auto shrink-0 object-contain sm:h-[282px]"
      />
    </div>
  );
}

export function DownloadSidebarRight({ related }: DownloadSidebarRightProps) {
  return (
    <aside className="flex w-full flex-col gap-[var(--lp-sidebar-gap)] lg:w-[418px] lg:shrink-0">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <SidebarPanel title="Our App">
          <OurAppContent />
        </SidebarPanel>
      </motion.div>

      <RelatedWallpapers items={related} />
    </aside>
  );
}
