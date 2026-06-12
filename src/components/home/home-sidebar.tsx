"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, LayoutGrid, TrendingUp } from "lucide-react";
import { trendingTopics } from "@/data/sidebar";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import { SidebarCollapsible } from "@/components/shared/sidebar-collapsible";
import { useCategories, useResolutions } from "@/hooks/use-catalog";
import { buildFilterHref, normalizeResolution } from "@/lib/filter-url";
import { cn } from "@/lib/utils";

function ResolutionChip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "mx-2 rounded-md border  bg-hw-deep px-1 py-2.5 text-center text-[13px] font-medium leading-tight transition-colors",
        active
          ? "border-[#3A3E41] text-hw-green"
          : "border-[#3A3E41] text-hw-foreground hover:border-hw-green/40"
      )}
    >
      {label}
    </Link>
  );
}

function CategoryBadge({
  count,
  isPremium,
}: {
  count: number;
  isPremium?: boolean;
}) {
  return (
    <span
      className={cn(
        "min-w-[28px] rounded-full px-2 py-0.5 text-center text-[11px] font-medium tabular-nums text-hw-foreground",
        isPremium ? "border border-hw-yellow bg-transparent" : "bg-hw-line"
      )}
    >
      {count}
    </span>
  );
}

const CATEGORIES_PER_PAGE = 20;

export function HomeSidebar() {
  const [qrOpen, setQrOpen] = useState(true);
  const [catPage, setCatPage] = useState(0);
  const { categories, loading } = useCategories();
  const res = useResolutions();
  const searchParams = useSearchParams();
  const activeResolution = searchParams.get("resolution") || "";

  const totalCatPages = Math.max(1, Math.ceil(categories.length / CATEGORIES_PER_PAGE));
  const safeCatPage = Math.min(catPage, totalCatPages - 1);
  const catSlice = categories.slice(
    safeCatPage * CATEGORIES_PER_PAGE,
    safeCatPage * CATEGORIES_PER_PAGE + CATEGORIES_PER_PAGE
  );
  const showCatPager = categories.length > CATEGORIES_PER_PAGE;

  return (
    <aside className="hidden w-full flex-col gap-3 lg:flex lg:w-[310px] lg:shrink-0">
      <SidebarPanel title="Resolution">
        <SidebarCollapsible label="Browse Resolutions" defaultOpen>
          <div>
            <p className="mb-2  ml-4 text-[16px] font-medium uppercase tracking-wider text-hw-muted">
              Popular Desktop
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {res.desktop.map((label) => (
                <ResolutionChip
                  key={label}
                  label={label}
                  href={buildFilterHref(searchParams, { resolution: normalizeResolution(label) })}
                  active={activeResolution === normalizeResolution(label)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2  ml-4 text-[16px] font-medium uppercase tracking-wider text-hw-muted">
              Popular Mobile
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {res.mobile.map((label) => (
                <ResolutionChip
                  key={label}
                  label={label}
                  href={buildFilterHref(searchParams, { resolution: normalizeResolution(label) })}
                  active={activeResolution === normalizeResolution(label)}
                />
              ))}
            </div>
          </div>
        </SidebarCollapsible>
      </SidebarPanel>

      <SidebarPanel title="Our App">
        <div className="border border-hw-line my-4"></div>
        <a
          href="https://play.google.com/store/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 rounded-md border border-hw-line bg-[#1C2129] px-3 py-2.5 transition-opacity hover:opacity-90 py-4 mx-4"
        >
          <Image
            src="/google-logo.svg"
            alt=""
            width={100}
            height={40}
            className="size-10 shrink-0 object-contain"
          />
          <div className="leading-tight">
            <p className="text-[12px] uppercase tracking-wide text-hw-muted font-semibold">
              Get it on
            </p>
            <p className="text-base font-semibold text-hw-foreground">Google Play</p>
          </div>
        </a>

        <button
          type="button"
          onClick={() => setQrOpen((v) => !v)}
          aria-expanded={qrOpen}
          className="mt-4 flex w-full items-center justify-center gap-1 text-sm text-hw-muted font-bold transition-colors hover:text-hw-foreground"
        >
          Scan QR Code
          <ChevronUp
            className={cn(
              "size-5 font-bold transition-transform duration-300",
              !qrOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {qrOpen && (
            <motion.div
              key="qr"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-col items-center">
                <div className="overflow-hidden rounded-lg bg-white p-2">
                  <Image
                    src="/qr-code-logo.png"
                    alt="Scan to download on Google Play"
                    width={160}
                    height={160}
                    className="size-[140px] object-contain"
                  />
                </div>
                <p className="mt-2 text-center font-medium text-[13px] text-hw-muted">
                  Google Play
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarPanel>

      <SidebarPanel title="Trending" icon={TrendingUp}>
        <ul>
          {trendingTopics.map((topic, index) => (
            <li
              key={topic}
              className={cn(index > 0 && "border-t border-hw-line")}
            >
              <Link
                href={`/?q=${encodeURIComponent(topic)}`}
                className="block py-4 font-medium text-[15px] text-hw-foreground transition-colors hover:text-hw-green mx-4"
              >
                {topic}
              </Link>
            </li>
          ))}
        </ul>
      </SidebarPanel>

      <SidebarPanel title="Categories" icon={LayoutGrid}>
        <SidebarCollapsible label="Browse Categories" defaultOpen>
          <ul>
            {loading && categories.length === 0 ? null : catSlice.map((category, index) => (
              <li
                key={category.id}
                className={cn(index > 0 && "border-t border-hw-line")}
              >
                <Link
                  href={buildFilterHref(searchParams, { category: category.slug })}
                  className="flex items-center justify-between gap-2 py-2.5"
                >
                  <span
                    className={cn(
                      "text-[13px]",
                      category.isPremium
                        ? "font-medium text-hw-yellow"
                        : "text-hw-foreground"
                    )}
                  >
                    {category.isPremium ? `${category.name} 💎` : category.name}
                  </span>
                  <CategoryBadge
                    count={category.count}
                    isPremium={category.isPremium}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {showCatPager && (
            <div className="mt-1 flex items-center justify-between border-t border-hw-line pt-2">
              <button
                type="button"
                aria-label="Previous categories"
                disabled={safeCatPage === 0}
                onClick={() => setCatPage((p) => Math.max(0, p - 1))}
                className="grid size-7 place-items-center rounded-md text-hw-muted transition-colors hover:bg-hw-surface hover:text-hw-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-[11px] tabular-nums text-hw-muted">
                {safeCatPage + 1} / {totalCatPages}
              </span>
              <button
                type="button"
                aria-label="Next categories"
                disabled={safeCatPage >= totalCatPages - 1}
                onClick={() => setCatPage((p) => Math.min(totalCatPages - 1, p + 1))}
                className="grid size-7 place-items-center rounded-md text-hw-muted transition-colors hover:bg-hw-surface hover:text-hw-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </SidebarCollapsible>
      </SidebarPanel>
    </aside>
  );
}
