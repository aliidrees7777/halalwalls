"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { filterPills } from "@/data/filters";
import { SiteHeader } from "@/components/home/site-header";
import { WallpaperSearch } from "@/components/home/wallpaper-search";
import { FilterPills } from "@/components/home/filter-pills";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { WallpaperGrid } from "@/components/home/wallpaper-grid";
import { WallpaperPagination } from "@/components/home/wallpaper-pagination";
import { SiteFooter } from "@/components/layout/site-footer";
import type { FilterId } from "@/types/wallpaper";

const validFilterIds = new Set(filterPills.map((p) => p.id));

export function HomePage() {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<FilterId>("latest");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Sync from URL so header search (?q=) and sidebar links (?category=) filter the grid
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const category = searchParams.get("category");
    setSearch(q);
    if (category && validFilterIds.has(category as FilterId)) {
      setActiveFilter(category as FilterId);
    }
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, [activeFilter, search, currentPage]);

  return (
    <div className="min-h-screen bg-hw-bg">
      <SiteHeader />

      <section className="bg-hw-search-header px-4 py-4 lg:px-6">
        <div className="mx-auto max-w-[1400px]">
          <WallpaperSearch value={search} onChange={setSearch} />
          <div className="mt-4">
            <FilterPills active={activeFilter} onChange={setActiveFilter} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-4 lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
          <HomeSidebar />

          <div className="min-w-0 flex-1">
            <WallpaperGrid
              filter={activeFilter}
              search={search}
              isLoading={isLoading}
            />
            <WallpaperPagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />

            {/* Mobile-only app banner (matches Figma mobile homepage) */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-hw-green/40 bg-hw-card p-3 lg:hidden">
              <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-black">
                <span className="text-lg font-bold text-hw-green">W</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-hw-foreground">
                  HalalWalls App
                </p>
                <p className="text-[11px] text-hw-muted">
                  Download wallpapers on the go
                </p>
              </div>
              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-2 rounded-lg bg-[#262626] px-3 py-2 text-xs text-hw-foreground transition-colors hover:bg-[#333]"
              >
                <Image
                  src="/google-play-logo.png"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4 object-contain"
                />
                Google Play
              </a>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
