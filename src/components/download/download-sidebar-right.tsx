"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GooglePlayButton } from "@/components/shared/google-play-button";
import { RelatedWallpapers } from "@/components/download/related-wallpapers";
import type { Wallpaper } from "@/types/wallpaper";

interface DownloadSidebarRightProps {
  related: Wallpaper[];
}

export function DownloadSidebarRight({ related }: DownloadSidebarRightProps) {
  return (
    <aside className="flex w-full flex-col gap-3 lg:w-[248px] lg:shrink-0">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="rounded-lg border border-[#2a2f2d] bg-hw-sidebar p-4"
      >
        <h2 className="mb-3 text-center text-[13px] font-semibold text-hw-foreground">
          Our App
        </h2>
        <div className="mx-auto max-w-[200px]">
          <div className="relative mx-auto w-[140px] rounded-[28px] border-[3px] border-[#3a3f3d] bg-[#0a0c0b] p-2 shadow-lg">
            <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-[#2a2f2d]" />
            <div className="mt-4 overflow-hidden rounded-[20px] bg-[#121412] p-3">
              <div className="flex items-center justify-center gap-1.5">
                <Image
                  src="/hw-logo.png"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
                <span className="text-[11px] font-bold text-hw-foreground">
                  HalalWalls
                </span>
              </div>
              <div className="mt-3 flex justify-center rounded-md bg-white p-1.5">
                <Image
                  src="/qr-code-logo.png"
                  alt="QR code"
                  width={100}
                  height={100}
                  className="size-[88px] object-contain"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <GooglePlayButton className="w-full" compact />
          </div>
        </div>
      </motion.section>

      <RelatedWallpapers items={related} />
    </aside>
  );
}
