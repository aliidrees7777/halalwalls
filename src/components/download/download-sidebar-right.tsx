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
        "my-5 flex w-[165px] items-center justify-center gap-2.5 rounded-md border border-hw-line bg-hw-play px-3 py-2.5 transition-opacity hover:opacity-90"
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

function OurAppPromo() {
  return (
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
        <span className="text-black dark:text-white">Halal</span>
        <span className="text-hw-green">Walls</span>
      </p>
      <GooglePlayButton />
      <p className="text-center text-[15px] font-medium text-hw-foreground sm:text-[16px]">
        Coming Soon...
      </p>
    </div>
  );
}

function OurAppContent() {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-5 sm:gap-4 sm:px-5">
      <OurAppPromo />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/detail-page/our-app-phone.svg"
        alt="HalalWalls mobile app preview"
        width={165}
        height={322}
        className="h-[240px] w-auto shrink-0 object-contain sm:h-[282px]"
      />
    </div>
  );
}

export function DownloadOurAppMobile() {
  return (
    <section className="mx-auto flex h-[380.73px] w-[384px] max-w-full flex-col overflow-hidden rounded-[6px] border-2 border-hw-line bg-hw-sidebar dark:border-[#3A3E41] dark:bg-[#181A1B]">
      <h2 className="flex h-[54.23px] shrink-0 items-center justify-center border-b-2 border-hw-line text-[18px] font-bold leading-[22px] text-hw-foreground dark:border-[#3A3E41] dark:text-[#A8A299]">
        Our App
      </h2>

      <div className="flex min-h-0 flex-1 items-center justify-center gap-[25.74px] px-0">
        <div className="flex w-[163.61px] shrink-0 flex-col items-center gap-[31.25px]">
          <div className="flex w-[101px] flex-col items-center gap-[11.14px]">
            {/* Native <img> for SVGs — next/image often breaks local SVG (optimizer/CSP). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/detail-page/our-app-logo.svg"
              alt="HalalWalls app"
              width={87}
              height={87}
              className="size-[87px] rounded-[9.16px] bg-black object-cover"
            />
            <p className="w-[101px] text-center text-[19.49px] font-bold leading-6 text-black dark:text-white">
              HalalWalls
            </p>
          </div>

          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[48.87px] w-full items-center justify-center gap-[11.09px] rounded-[5.31px] border-[0.55px] border-hw-line bg-hw-play px-[10px] dark:border-[#3A3E41] dark:bg-[#1C2129]"
          >
            <Image
              src="/google-play-logo.png"
              alt=""
              width={27}
              height={27}
              className="size-[27.11px] shrink-0 object-contain"
            />
            <div className="leading-none">
              <p className="text-[11.86px] font-semibold leading-[14px] text-hw-foreground/60 dark:text-[#A8A299]/60">
                Get it on
              </p>
              <p className="text-[15.25px] font-semibold leading-[18px] text-hw-foreground dark:text-[#A8A299]">
                Google Play
              </p>
            </div>
          </a>

          <p className="text-center text-[14.71px] font-medium leading-[18px] text-hw-foreground dark:text-white">
            Coming Soon...
          </p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/detail-page/our-app-phone.png"
          alt="HalalWalls mobile app preview"
          width={138}
          height={290}
          className="h-[289.61px] w-[137.87px] shrink-0 object-contain dark:drop-shadow-[0_0_2.76px_rgba(255,255,255,0.25)]"
        />
      </div>
    </section>
  );
}

export function DownloadSidebarRight({ related }: DownloadSidebarRightProps) {
  return (
    <aside className="flex w-full flex-col gap-[var(--lp-sidebar-gap)] lg:w-[418px] lg:shrink-0">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="hidden lg:block"
      >
        <SidebarPanel title="Our App">
          <OurAppContent />
        </SidebarPanel>
      </motion.div>

      <RelatedWallpapers items={related} />
    </aside>
  );
}
