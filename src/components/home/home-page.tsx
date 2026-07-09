"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/home/site-header";
import { WallpaperSearch } from "@/components/home/wallpaper-search";
import { FilterPills } from "@/components/home/filter-pills";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { WallpaperGrid } from "@/components/home/wallpaper-grid";
import { WallpaperPagination } from "@/components/home/wallpaper-pagination";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileAppBanner } from "@/components/shared/mobile-app-banner";
import { api } from "@/lib/api";
import type { Wallpaper } from "@/types/wallpaper";
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface WallpapersResponse {
  wallpapers: Wallpaper[];
  pagination: Pagination;
}

export function HomePage() {
  const searchParams = useSearchParams();
  // Filters live in the URL so they COMBINE: category (sidebar/header) + sort
  // (browse-mode pill) + tag (tag pill). q (search) is editable below.
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "latest";
  const tag = searchParams.get("tag") || "";
  const resolution = searchParams.get("resolution") || "";
  const qParam = searchParams.get("q") || "";

  const [search, setSearch] = useState(qParam);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Keep the search box in sync when q arrives via the URL (header search).
  useEffect(() => {
    setSearch(qParam);
  }, [qParam]);

  // Any filter change → back to page 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [category, sort, tag, resolution, search]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (tag) params.set("tag", tag);
    if (resolution) params.set("resolution", resolution);
    if (search) params.set("q", search);
    params.set("page", String(currentPage));
    params.set("limit", "18");

    api
      .get<WallpapersResponse>(`/wallpapers?${params.toString()}`)
      .then((data) => {
        if (ignore) return;
        setWallpapers(data.wallpapers);
        setPagination(data.pagination);
      })
      .catch(() => {
        if (ignore) return;
        setWallpapers([]);
        setPagination(null);
      })
      .finally(() => {
        if (ignore) return;
        setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [category, sort, tag, resolution, search, currentPage]);

  return (
    <div className="min-h-screen ">
      <SiteHeader />

      <section
        style={{ background: "var(--hw-search-header)" }}
        className="h-fit px-0 pt-[var(--lp-search-pt)] pb-0"
      >
        <div className="lp-container">
          <WallpaperSearch value={search} onChange={setSearch} />
          <div className="mt-[var(--lp-search-gap)] pb-10">
            <FilterPills />
          </div>
        </div>
      </section>

      <div className="lp-container bg-hw-bg pt-[var(--lp-mid-pt)]">
        <div className="flex flex-col gap-[var(--lp-sidebar-gap)] lg:flex-row lg:gap-[var(--lp-main-gap)]">
          <HomeSidebar />

          <div className="min-w-0 flex-1 lg:max-w-[var(--lp-main-w)]">
            <WallpaperGrid wallpapers={wallpapers} isLoading={isLoading} />
            <WallpaperPagination
              currentPage={currentPage}
              totalPages={pagination?.totalPages ?? 1}
              onPageChange={setCurrentPage}
              preview={(pagination?.totalPages ?? 1) <= 1}
            />

            <MobileAppBanner className="mt-4" />
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
