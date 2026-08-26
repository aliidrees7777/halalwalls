"use client";

import { motion } from "framer-motion";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import {
  desktopDownloadResolutions,
  mobileDownloadResolutions,
  filterResolutionsForSource,
} from "@/data/resolutions";
import { normalizeResKey } from "@/lib/download-resolution";
import { cn } from "@/lib/utils";
import type { DownloadResolution, WallpaperDetail } from "@/types/wallpaper";

function ResolutionLinkList({
  title,
  items,
  selectedKey,
  onSelect,
}: {
  title: string;
  items: DownloadResolution[];
  selectedKey?: string | null;
  onSelect?: (item: DownloadResolution) => void;
}) {
  if (!items.length) {
    return (
      <div>
        <p className="mb-2 text-[15px] font-medium text-hw-muted">{title}</p>
        <p className="text-[14px] text-hw-muted">
          No sizes available without upscaling this image.
        </p>
      </div>
    );
  }

  const active = selectedKey ? normalizeResKey(selectedKey) : "";

  return (
    <div>
      <p className="mb-2 text-[15px] font-medium text-hw-muted">{title}</p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5 lg:gap-x-8">
        {items.map((item) => {
          const isSelected = active === normalizeResKey(item.label);
          return (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => onSelect?.(item)}
                aria-current={isSelected ? "true" : undefined}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[16px] transition-colors",
                  isSelected
                    ? "bg-[#555555] font-semibold text-white no-underline dark:bg-hw-pill2 dark:text-hw-foreground"
                    : "text-hw-muted underline underline-offset-2 decoration-hw-muted/70 hover:text-hw-foreground hover:decoration-hw-foreground",
                )}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface DownloadResolutionPanelProps {
  wallpaper: WallpaperDetail;
  selectedResolution?: string | null;
  onSelect?: (resolution: DownloadResolution) => void;
}

export function DownloadResolutionPanel({
  wallpaper,
  selectedResolution,
  onSelect,
}: DownloadResolutionPanelProps) {
  // Prefer server-filtered catalog; fall back to client filter on source dims.
  const hasDedicatedMobile = Boolean(wallpaper.mobileOriginalUrl);
  const desktop =
    wallpaper.downloadResolutions?.desktop ??
    filterResolutionsForSource(
      desktopDownloadResolutions,
      wallpaper.width,
      wallpaper.height,
    );
  const mobile =
    wallpaper.downloadResolutions?.mobile ??
    filterResolutionsForSource(
      mobileDownloadResolutions,
      hasDedicatedMobile ? wallpaper.mobileWidth : wallpaper.width,
      hasDedicatedMobile ? wallpaper.mobileHeight : wallpaper.height,
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <SidebarPanel
        title="Download Different Resolutions"
        iconSrc="/Download-icon-dark.svg"
        iconSrcLight="/Download-icon-light.svg"
        iconPosition="before"
        iconClassName="h-4 w-[21px] shrink-0"
        className="bg-hw-deep"
        titleClassName="justify-start gap-2.5 px-5"
      >
        <div className="px-5 py-4">
          <ResolutionLinkList
            title="Popular Desktop Resolutions"
            items={desktop}
            selectedKey={selectedResolution}
            onSelect={onSelect}
          />
        </div>
        <div
          className="border-t-[length:var(--lp-panel-divider)] border-hw-line"
          aria-hidden
        />
        <div className="px-5 py-4">
          <ResolutionLinkList
            title="Popular Mobile Resolutions"
            items={mobile}
            selectedKey={selectedResolution}
            onSelect={onSelect}
          />
        </div>
      </SidebarPanel>
    </motion.div>
  );
}
