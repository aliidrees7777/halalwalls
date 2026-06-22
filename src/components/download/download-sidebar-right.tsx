"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GooglePlayButton } from "@/components/shared/google-play-button";
import { RelatedWallpapers } from "@/components/download/related-wallpapers";
import type { Wallpaper } from "@/types/wallpaper";
import mobilelog from "../../../public/detail-page/mobile-logo.svg";
interface DownloadSidebarRightProps {
  related: Wallpaper[];
}

export function DownloadSidebarRight({ related }: DownloadSidebarRightProps) {
  return (
    <aside className="flex w-full flex-col gap-3 lg:w-[360px]  lg:shrink-0">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className=" border border-hw-line bg-hw-sidebar  xl:block"
      >
        <h2 className="text-[13px] mb-3 text-center font-semibold text-hw-foreground pt-3">
          Our App
        </h2>
        <div className="my-4 h-0.5 bg-hw-line "></div>
        <div className="flex flex-col items-center gap-6 lg:hidden">
          <div className="flex w-full items-center justify-around">
            <div className="flex flex-col items-center">
              <div className="overflow-hidden rounded-lg bg-white p-2">
                <Image
                  src="/qr-code-logo.png"
                  alt="Scan to download on Google Play"
                  width={110}
                  height={110}
                  className="size-[100px] object-contain"
                />
              </div>
              <p className="mt-2 text-center font-medium text-hw-muted text-[13px]">
                Google Play
              </p>
            </div>
            <Image src={mobilelog} alt="mobile-logo" width={100} height={150} />
          </div>

          {/* Button - Now follows document flow instead of absolute positioning */}
          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center mb-2 justify-center gap-3 rounded-md border border-hw-line w-full max-w-[216px] bg-hw-play px-3 py-2.5 transition-opacity hover:opacity-90"
          >
            <Image
              src="/google-logo.svg"
              alt=""
              width={80}
              height={40}
              className="size-10 shrink-0 object-contain"
            />
            <div className="leading-tight">
              <p className="text-[12px] uppercase tracking-wide text-hw-muted font-semibold">
                Get it on
              </p>
              <p className="text-base font-semibold text-hw-muted">
                Google Play
              </p>
            </div>
          </a>
        </div>
        <div className="mx-auto lg:flex justify-around hidden">
          <div className="mt-4">
            <div className=" flex flex-col items-center">
              <div className="overflow-hidden rounded-lg bg-white p-2">
                <Image
                  src="/qr-code-logo.png"
                  alt="Scan to download on Google Play"
                  width={110}
                  height={110}
                  className="size-[100px] object-contain"
                />
              </div>
              <p className="mt-2 text-center font-medium text-hw-muted text-[13px]">
                Google Play
              </p>
            </div>
          </div>
          <Image src={mobilelog} alt="mobile-logo" width={150} />
          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute hidden right-70 bg-conic-0 -bottom-13  top-114 lg:flex items-center justify-center gap-3 rounded-md border border-hw-line w-[216px] bg-hw-play px-3 py-2.5 transition-opacity hover:opacity-90  mx-4"
          >
            <Image
              src="/google-logo.svg"
              alt=""
              width={80}
              height={40}
              className="size-10 shrink-0 object-contain"
            />
            <div className="leading-tight">
              <p className="text-[12px] uppercase tracking-wide text-hw-muted font-semibold">
                Get it on
              </p>
              <p className="text-base font-semibold text-hw-muted">
                Google Play
              </p>
            </div>
          </a>
        </div>
      </motion.section>

      <RelatedWallpapers items={related} />
    </aside>
  );
}
