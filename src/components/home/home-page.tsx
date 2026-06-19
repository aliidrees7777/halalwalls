"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/home/site-header";
import { WallpaperSearch } from "@/components/home/wallpaper-search";
import { FilterPills } from "@/components/home/filter-pills";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { WallpaperGrid } from "@/components/home/wallpaper-grid";
import { WallpaperPagination } from "@/components/home/wallpaper-pagination";
import { WallpaperStats } from "@/components/home/wallpaper-stats";
import { SiteFooter } from "@/components/layout/site-footer";
import { api } from "@/lib/api";
import type { Wallpaper } from "@/types/wallpaper";
import wallpapersData from "../../data/wallpapers.json";
import logodark from "../../../public/authicon/logodark.svg"
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

  // useEffect(() => {
  //   let ignore = false;
  //   setIsLoading(true);

  //   const params = new URLSearchParams();
  //   if (category) params.set("category", category);
  //   if (sort) params.set("sort", sort);
  //   if (tag) params.set("tag", tag);
  //   if (resolution) params.set("resolution", resolution);
  //   if (search) params.set("q", search);
  //   params.set("page", String(currentPage));
  //   params.set("limit", "18");

  //   api
  //     .get<WallpapersResponse>(`/wallpapers?${params.toString()}`)
  //     .then((data) => {
  //       if (ignore) return;
  //       setWallpapers(data.wallpapers);
  //       setPagination(data.pagination);
  //     })
  //     .catch(() => {
  //       if (ignore) return;
  //       setWallpapers([]);
  //       setPagination(null);
  //     })
  //     .finally(() => {
  //       if (ignore) return;
  //       setIsLoading(false);
  //     });

  //   return () => {
  //     ignore = true;
  //   };
  // }, [category, sort, tag, resolution, search, currentPage]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    try {
      let data = [...wallpapersData];

      // filters
      if (category) {
        data = data.filter((w) => w.category === category);
      }

      if (resolution) {
        data = data.filter((w) => w.resolution === resolution);
      }

      if (search) {
        data = data.filter((w) =>
          w.title.toLowerCase().includes(search.toLowerCase()),
        );
      }

      // pagination (client side)
    const limit = 18;
    const start = (currentPage - 1) * limit;
    const paginated = data.slice(start, start + limit);

    const pagination = {
      total: data.length,
      page: currentPage,
      limit,
      totalPages: Math.ceil(data.length / limit),
      hasNextPage: start + limit < data.length,
      hasPrevPage: currentPage > 1,
    };

    if (!ignore) {
      setWallpapers(paginated as unknown as Wallpaper[]);
      setPagination(pagination);
    }
    } catch (e) {
      if (!ignore) {
        setWallpapers([]);
        setPagination(null);
      }
    } finally {
      if (!ignore) setIsLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [category, sort, tag, resolution, search, currentPage]);

  return (
    <div className="min-h-screen ">
      <SiteHeader />

      <section 
      style={{ background: "var(--hw-search-header)" }}
      className=" px-4 py-4 lg:px-6">
        <div className="mx-auto max-w-[1600px]">
          <WallpaperSearch value={search} onChange={setSearch} />
          <div className="mt-4">
            <FilterPills />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1650px] px-4 py-4 lg:px-6 bg-hw-bg">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
          <HomeSidebar />

          <div className="min-w-0 flex-1">
            <WallpaperGrid wallpapers={wallpapers} isLoading={isLoading} />
            <WallpaperPagination
              currentPage={currentPage}
              totalPages={pagination?.totalPages ?? 1}
              onPageChange={setCurrentPage}
            />

            {/* Mobile-only app banner (matches Figma mobile homepage) */}
            <div className="mt-4 flex items-center justify-center gap-[22px] rounded-xl border border-hw-green/40 bg-[#CBFFEB] p-3 lg:hidden h-[120px]">
              <div className="grid shrink-0">
                <span className="text-lg font-bold text-hw-green">
<Image src={logodark} alt="logodark" className="w-[84px]"/>
                </span>
              </div>
              <div className="min-w-0 ">
                <p className="text-[20px] font-bold text-hw-deep">
                  HalalWalls App
                </p>
                <p className="text-[12px] text-hw-deep">
                  Download wallpapers on the go
                </p>
                  <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-2 rounded-lg bg-hw-pill px-3 py-2  mt-2 w-[150px]"
              >
                <Image
                  src="/google-play-logo.png"
                  alt=""
                  width={16}
                  height={16}
                  className="size-6 object-contain"
                />
                <div>
                <p className="text-[10px] font-semibold">Get it on</p>
               <p className="text-[13px] font-semibold">Google Play</p>
               </div>
              </a>
              </div>
            
            </div>
          </div>
        </div>
      </div>

      <WallpaperStats />
      <SiteFooter />
    </div>
  );
}
