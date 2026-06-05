"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import {
  desktopResolutions,
  mobileResolutions,
  sidebarCategories,
} from "@/data/sidebar";
import { downloadSidebarTags } from "@/data/download-tags";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import { SidebarCollapsible } from "@/components/shared/sidebar-collapsible";
import { GooglePlayButton } from "@/components/shared/google-play-button";
import { QrCodePanel } from "@/components/shared/qr-code-panel";
import { ResolutionChips } from "@/components/shared/resolution-chips";
import { CategorySidebarList } from "@/components/shared/category-sidebar-list";
import { cn } from "@/lib/utils";
import type { FilterId } from "@/types/wallpaper";

interface DownloadSidebarLeftProps {
  activeCategory: FilterId;
  tags?: string[];
}

export function DownloadSidebarLeft({
  activeCategory,
  tags = downloadSidebarTags,
}: DownloadSidebarLeftProps) {
  return (
    <aside className="flex w-full flex-col gap-3 lg:w-[248px] lg:shrink-0">
      <SidebarPanel title="Resolution">
        <SidebarCollapsible label="Browse Resolutions" defaultOpen>
          <div>
            <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-hw-muted">
              Popular Desktop
            </p>
            <ResolutionChips resolutions={desktopResolutions} />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-hw-muted">
              Popular Mobile
            </p>
            <ResolutionChips resolutions={mobileResolutions} />
          </div>
        </SidebarCollapsible>
      </SidebarPanel>

      <SidebarPanel title="Our App">
        <GooglePlayButton />
        <QrCodePanel />
      </SidebarPanel>

      <SidebarPanel title="Tags #">
        <ul>
          {tags.map((tag, index) => (
            <li
              key={tag}
              className={cn(index > 0 && "border-t border-[#2a2f2d]")}
            >
              <Link
                href="/"
                className="block py-2.5 text-[13px] text-hw-foreground transition-colors hover:text-hw-green"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </SidebarPanel>

      <SidebarPanel title="Categories" icon={LayoutGrid}>
        <SidebarCollapsible label="Browse Categories" defaultOpen>
          <CategorySidebarList
            categories={sidebarCategories}
            activeCategory={activeCategory}
          />
        </SidebarCollapsible>
      </SidebarPanel>
    </aside>
  );
}
