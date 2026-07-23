"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { RelatedWallpapers } from "@/components/download/related-wallpapers";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import type { Wallpaper } from "@/types/wallpaper";
import mobilelog from "../../../public/detail-page/mobile-logo.svg";

interface DownloadSidebarRightProps {
  related: Wallpaper[];
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
          <div className="flex flex-col items-center gap-6 px-4 pb-4 pt-4 lg:hidden">
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
                <p className="mt-2 text-center text-[13px] font-medium text-hw-muted">
                  Google Play
                </p>
              </div>
              <Image src={mobilelog} alt="mobile-logo" width={100} height={150} />
            </div>

            <a
              href="https://play.google.com/store/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 flex w-full max-w-[216px] items-center justify-center gap-3 rounded-md border border-hw-line bg-hw-play px-3 py-2.5 transition-opacity hover:opacity-90"
            >
              <Image
                src="/google-logo.svg"
                alt=""
                width={80}
                height={40}
                className="size-10 shrink-0 object-contain"
              />
              <div className="leading-tight">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-hw-muted">
                  Get it on
                </p>
                <p className="text-base font-semibold text-hw-muted">
                  Google Play
                </p>
              </div>
            </a>
          </div>

          <div className="hidden items-start justify-between gap-2 px-4 pb-4 pt-4 lg:flex">
            <div className="flex h-[282px] flex-col items-center justify-between">
              <Image
                src="/detail-page/scanlogo.svg"
                alt="Scan to download on Google Play"
                width={116}
                height={156}
                className="w-[150px] object-contain"
                style={{ height: "auto" }}
              />
              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-[216px] items-center justify-center gap-3 rounded-md border border-hw-line bg-hw-play px-3 py-2.5 transition-opacity hover:opacity-90"
              >
                <Image
                  src="/google-logo.svg"
                  alt=""
                  width={80}
                  height={40}
                  className="size-10 shrink-0 object-contain"
                />
                <div className="leading-tight">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-hw-muted">
                    Get it on
                  </p>
                  <p className="text-base font-semibold text-hw-muted">
                    Google Play
                  </p>
                </div>
              </a>
            </div>
            <Image src={mobilelog} alt="mobile-logo" width={150} height={282} className="h-[282px]" style={{ width: "auto" }} />
          </div>
        </SidebarPanel>
      </motion.div>

      <RelatedWallpapers items={related} />
    </aside>
  );
}
