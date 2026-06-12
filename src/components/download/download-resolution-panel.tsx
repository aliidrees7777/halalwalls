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
}: {
  title: string;
  items: DownloadResolution[];
  onSelect?: (item: DownloadResolution) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-hw-muted">
        {title}
      </p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
        {items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => onSelect?.(item)}
              className="text-[13px] text-[#6b8cae] underline decoration-[#6b8cae]/50 underline-offset-2 transition-colors hover:text-hw-green hover:decoration-hw-green/50"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface DownloadResolutionPanelProps {
  onSelect?: (resolution: DownloadResolution) => void;
}

export function DownloadResolutionPanel({
  onSelect,
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
        <ResolutionLinkList
          title="Popular Desktop Resolutions"
          items={desktopDownloadResolutions}
          onSelect={onSelect}
        />
        <div className="my-4 h-px bg-hw-line" />
        <ResolutionLinkList
          title="Popular Mobile Resolutions"
          items={mobileDownloadResolutions}
          onSelect={onSelect}
        />
      </SidebarPanel>
    </motion.div>
  );
}
