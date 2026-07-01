"use client";

import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import {
  desktopDownloadResolutions,
  mobileDownloadResolutions,
} from "@/data/resolutions";
import type { DownloadResolution } from "@/types/wallpaper";

function ResolutionLinkList({
  title,
  items,
  onSelect,
  downloading,
}: {
  title: string;
  items: DownloadResolution[];
  onSelect?: (item: DownloadResolution) => void;
  downloading?: string | null;
}) {
  return (
    <div>
      <p className="mb-2 ml-5 text-[16px] font-semibold  tracking-wider text-hw-foreground">
        {title}
      </p>
      <ul className=" ml-5 flex flex-wrap gap-x-3 gap-y-1.5">
        {items.map((item) => {
          const busy = downloading === `${item.width}x${item.height}`;
          return (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => onSelect?.(item)}
                disabled={downloading !== null && downloading !== undefined}
                className="text-[16px] text-hw-foreground underline decoration-hw-foreground underline-offset-2 transition-colors hover:text-hw-green hover:decoration-hw-green/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {item.label}
                {busy ? " …" : ""}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface DownloadResolutionPanelProps {
  onSelect?: (resolution: DownloadResolution) => void;
  downloading?: string | null;
}

export function DownloadResolutionPanel({
  onSelect,
  downloading,
}: DownloadResolutionPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <SidebarPanel
        title="Download Different Resolutions"
        icon={Download}
        className="bg-hw-deep"
      >
        <div className="my-4 h-0.5 bg-hw-line " />
        <ResolutionLinkList
          title="Popular Desktop Resolutions"
          items={desktopDownloadResolutions}
          onSelect={onSelect}
          downloading={downloading}
        />
        <div className="my-4 h-0.5 bg-hw-line" />
        <ResolutionLinkList
          title="Popular Mobile Resolutions"
          items={mobileDownloadResolutions}
          onSelect={onSelect}
          downloading={downloading}
        />
      </SidebarPanel>
    </motion.div>
  );
}
