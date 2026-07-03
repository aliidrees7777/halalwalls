"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import {
  desktopDownloadResolutions,
  mobileDownloadResolutions,
} from "@/data/resolutions";
import { api } from "@/lib/api";
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
      <p className="mb-2 ml-5 text-[16px] font-semibold  tracking-wider text-hw-foreground">
        {title}
      </p>
      <ul className=" ml-5 flex flex-wrap gap-x-3 gap-y-1.5">
        {items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => onSelect?.(item)}
              className="text-[16px] text-hw-foreground underline decoration-hw-foreground underline-offset-2 transition-colors hover:text-hw-green hover:decoration-hw-green/50"
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
  // Live, admin-managed resolution catalog (falls back to the static list).
  const [desktop, setDesktop] = useState<DownloadResolution[]>(desktopDownloadResolutions);
  const [mobile, setMobile] = useState<DownloadResolution[]>(mobileDownloadResolutions);

  useEffect(() => {
    let ignore = false;
    api
      .get<{ list: DownloadResolution[] }>("/resolutions")
      .then((d) => {
        if (ignore) return;
        const list = d.list ?? [];
        const desk = list.filter((r) => r.device === "desktop");
        const mob = list.filter((r) => r.device === "mobile");
        if (desk.length) setDesktop(desk);
        if (mob.length) setMobile(mob);
      })
      .catch(() => {});
    return () => { ignore = true; };
  }, []);

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
          items={desktop}
          onSelect={onSelect}
        />
        <div className="my-4 h-0.5 bg-hw-line" />
        <ResolutionLinkList
          title="Popular Mobile Resolutions"
          items={mobile}
          onSelect={onSelect}
        />
      </SidebarPanel>
    </motion.div>
  );
}
