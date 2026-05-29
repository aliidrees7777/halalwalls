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
import { GooglePlayButton } from "@/components/shared/google-play-button";
import { QrCodePanel } from "@/components/shared/qr-code-panel";
import { ResolutionChips } from "@/components/shared/resolution-chips";
import { CategorySidebarList } from "@/components/shared/category-sidebar-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        <Select defaultValue="browse">
          <SelectTrigger className="h-9 w-full rounded-md border-[#3a3f3d] bg-[#0d0f0e] text-[13px] text-hw-muted shadow-none">
            <SelectValue placeholder="Browse Resolutions" />
          </SelectTrigger>
          <SelectContent className="border-[#2a2f2d] bg-hw-sidebar">
            <SelectItem value="browse">Browse Resolutions</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
          </SelectContent>
        </Select>

        <div className="mt-4">
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
                href="#"
                className="block py-2.5 text-[13px] text-hw-foreground transition-colors hover:text-hw-green"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </SidebarPanel>

      <SidebarPanel title="Categories" icon={LayoutGrid}>
        <Select defaultValue="browse">
          <SelectTrigger className="h-9 w-full rounded-md border-[#3a3f3d] bg-[#0d0f0e] text-[13px] text-hw-muted shadow-none">
            <SelectValue placeholder="Browse Categories" />
          </SelectTrigger>
          <SelectContent className="border-[#2a2f2d] bg-hw-sidebar">
            <SelectItem value="browse">Browse Categories</SelectItem>
            <SelectItem value="all">All Categories</SelectItem>
          </SelectContent>
        </Select>

        <div className="mt-2">
          <CategorySidebarList
            categories={sidebarCategories}
            activeCategory={activeCategory}
          />
        </div>
      </SidebarPanel>
    </aside>
  );
}
