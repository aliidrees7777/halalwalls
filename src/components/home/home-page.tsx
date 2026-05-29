"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/home/site-header";
import { WallpaperSearch } from "@/components/home/wallpaper-search";
import { FilterPills } from "@/components/home/filter-pills";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { WallpaperGrid } from "@/components/home/wallpaper-grid";
import { WallpaperPagination } from "@/components/home/wallpaper-pagination";
import { SiteFooter } from "@/components/layout/site-footer";
import type { FilterId } from "@/types/wallpaper";

export function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("latest");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

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
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
