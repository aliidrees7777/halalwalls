"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trendingTopics } from "@/data/sidebar";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import { SidebarCollapsible } from "@/components/shared/sidebar-collapsible";
import { useCategories, useResolutions } from "@/hooks/use-catalog";
import { buildFilterHref, normalizeResolution } from "@/lib/filter-url";
import { cn } from "@/lib/utils";
import dimon from "../../../public/dimon.svg";
function ResolutionChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-[var(--lp-chip-h)] min-w-0 items-center justify-center rounded-[var(--lp-chip-radius)] border-[length:var(--lp-chip-border)] border-hw-line bg-transparent px-1 text-center text-[length:var(--lp-chip-font)] font-medium uppercase leading-none text-hw-foreground transition-colors",
        active &&
          "border-hw-green bg-hw-green/10 font-bold text-hw-green",
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
        "flex h-[21.34px] min-w-[63.13px] shrink-0 items-center justify-center rounded-full border-[length:var(--lp-panel-divider-thin)] px-4 text-center text-[length:var(--lp-panel-item)] font-bold leading-[17px] tabular-nums",
        isPremium
          ? "border-hw-yellow bg-hw-lines text-hw-yellow"
          : "border-hw-line bg-hw-lines text-white",
      )}
    >
      {count}
    </span>
  );
}

const CATEGORIES_PER_PAGE = 20;

interface HomeSidebarProps {
  /** When provided, the third panel renders these wallpaper tags ("Tags #")
   *  instead of the "Trending" list (wallpaper detail page variant). */
  tags?: string[];
  /** Slug of the category to highlight as active (wallpaper detail page). */
  activeCategory?: string;
  /** Live search query (home page) — highlights matching Trending / Tags items. */
  searchQuery?: string;
}

export function HomeSidebar({
  tags,
  activeCategory,
  searchQuery,
}: HomeSidebarProps = {}) {
  const [qrOpen, setQrOpen] = useState(true);
  const [catPage, setCatPage] = useState(0);
  const { categories, loading } = useCategories();
  const res = useResolutions();
  const searchParams = useSearchParams();
  const activeResolution = searchParams.get("resolution") || "";
  const activeQuery = (
    searchQuery ??
    searchParams.get("q") ??
    ""
  )
    .trim()
    .toLowerCase();
  // Prefer explicit prop (detail page), else URL ?category= (home filters).
  const selectedCategory =
    activeCategory || searchParams.get("category") || "";

  const totalCatPages = Math.max(
    1,
    Math.ceil(categories.length / CATEGORIES_PER_PAGE),
  );
  const safeCatPage = Math.min(catPage, totalCatPages - 1);
  const catSlice = categories.slice(
    safeCatPage * CATEGORIES_PER_PAGE,
    safeCatPage * CATEGORIES_PER_PAGE + CATEGORIES_PER_PAGE,
  );
  const showCatPager = categories.length > CATEGORIES_PER_PAGE;

  return (
    <aside className="hidden w-full flex-col gap-[var(--lp-sidebar-gap)] lg:flex lg:w-[var(--lp-sidebar-w)] lg:shrink-0">
      <SidebarPanel title="Resolution">
        <SidebarCollapsible label="Browse Resolutions" defaultOpen>
          <div className="px-4">
            <p className="mb-2 text-[length:var(--lp-panel-label)] font-medium uppercase leading-[17px] text-hw-foreground">
              Popular Desktop
            </p>
            <div className="grid grid-cols-3 gap-[var(--lp-chip-gap)]">
              {res.desktop.map((label) => (
                <ResolutionChip
                  key={label}
                  label={label}
                  href={buildFilterHref(searchParams, {
                    resolution: normalizeResolution(label),
                  })}
                  active={activeResolution === normalizeResolution(label)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 px-4">
            <p className="mb-2 text-[length:var(--lp-panel-label)] font-medium uppercase leading-[17px] text-hw-foreground">
              Popular Mobile
            </p>
            <div className="grid grid-cols-3 gap-[var(--lp-chip-gap)] mb-4">
              {res.mobile.map((label) => (
                <ResolutionChip
                  key={label}
                  label={label}
                  href={buildFilterHref(searchParams, {
                    resolution: normalizeResolution(label),
                  })}
                  active={activeResolution === normalizeResolution(label)}
                />
              ))}
            </div>
          </div>
        </SidebarCollapsible>
      </SidebarPanel>

      <SidebarPanel title="Our App">
        <div className="px-4 pt-4 pb-3">
          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[var(--lp-play-btn-h)] w-full items-center justify-center gap-[17.78px] rounded-[var(--lp-play-btn-radius)] border-[length:var(--lp-panel-divider-thin)] border-hw-line bg-hw-play px-4 transition-opacity hover:opacity-90"
          >
            <Image
              src="/google-logo.svg"
              alt=""
              width={29}
              height={29}
              className="size-[28.45px] shrink-0 object-contain"
            />
            <div className="leading-tight">
              <p className="text-[12.45px] font-semibold text-hw-foreground/60">
                Get it on
              </p>
              <p className="text-[16px] font-semibold text-hw-foreground">
                Google Play
              </p>
            </div>
          </a>

          <button
            type="button"
            onClick={() => setQrOpen((v) => !v)}
            aria-expanded={qrOpen}
            className="mt-[14.23px] flex w-full items-center justify-center gap-[14.23px] text-[length:var(--lp-panel-label)] font-bold text-hw-foreground transition-colors hover:text-hw-green"
          >
            Scan QR Code
            <svg
              width="12"
              height="7"
              viewBox="0 0 11 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "transition-transform duration-200",
                qrOpen && "rotate-180",
              )}
            >
              <path
                d="M9.4199 0H0.890855C0.126943 0 -0.281331 0.89974 0.221709 1.47464L4.48623 6.34838C4.84047 6.75323 5.47028 6.75323 5.82452 6.34838L10.089 1.47464C10.5921 0.89974 10.1838 0 9.4199 0Z"
                fill="#A8A299"
              />
            </svg>
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
                <div className="mt-[14.23px] flex flex-col items-center gap-[14.23px]">
                  <div className="overflow-hidden rounded-[10.67px] bg-white p-[3.56px]">
                    <Image
                      src="/qr-code-logo.png"
                      alt="Scan to download on Google Play"
                      width={143}
                      height={143}
                      className="size-[var(--lp-qr-size)] object-contain"
                    />
                  </div>
                  <p className="text-center text-[12.45px] font-medium text-hw-foreground/60">
                    Google Play
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarPanel>

      {tags ? (
        <SidebarPanel title="Tags #">
          <ul>
            {tags.map((tag, index) => {
              const isActive = activeQuery === tag.trim().toLowerCase();
              return (
              <li
                key={tag}
                className={cn(index > 0 && "border-t-[length:var(--lp-panel-divider-thin)] border-hw-line")}
              >
                <Link
                  href={`/?q=${encodeURIComponent(tag)}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block px-[11px] py-[11px] text-[length:var(--lp-panel-item)] font-medium leading-[17px] transition-colors hover:text-hw-green",
                    isActive
                      ? "bg-hw-green/10 font-bold text-hw-green"
                      : "text-hw-foreground",
                  )}
                >
                  {tag}
                </Link>
              </li>
              );
            })}
          </ul>
        </SidebarPanel>
      ) : (
        <SidebarPanel title="Trending" iconSrc="/tranding.svg">
          <ul>
            {trendingTopics.map((topic, index) => {
              const isActive = activeQuery === topic.trim().toLowerCase();
              return (
              <li
                key={topic}
                className={cn(index > 0 && "border-t-[length:var(--lp-panel-divider-thin)] border-hw-line")}
              >
                <Link
                  href={`/?q=${encodeURIComponent(topic)}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block px-[11px] py-[11px] text-[length:var(--lp-panel-item)] font-medium leading-[17px] transition-colors hover:text-hw-green",
                    isActive
                      ? "bg-hw-green/10 font-bold text-hw-green"
                      : "text-hw-foreground",
                  )}
                >
                  {topic}
                </Link>
              </li>
              );
            })}
          </ul>
        </SidebarPanel>
      )}
      <SidebarPanel
        title="Categories"
        iconSrc="/categories.svg"
        iconClassName="size-[17.78px] shrink-0"
      >

        <SidebarCollapsible
          label="Browse Categories"
          defaultOpen
          labelClassName="font-bold"
          contentClassName="pt-0"
        >
          <ul>
            {loading && categories.length === 0
              ? null
              : catSlice.map((category, index) => {
                  const isActive = selectedCategory === category.slug;
                  return (
                  <li
                    key={category.id}
                    className={cn(index > 0 && "border-t-[length:var(--lp-panel-divider-thin)] border-hw-line")}
                  >
                    <Link
                      href={buildFilterHref(searchParams, {
                        category: category.slug,
                      })}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between gap-2 px-[10px] py-[11px] transition-colors",
                        isActive && "bg-hw-green/10",
                      )}
                    >
                      <span
                        className={cn(
                          "flex min-w-0 items-center gap-1 text-[length:var(--lp-panel-item)] font-medium leading-[17px]",
                          category.isPremium
                            ? "text-hw-yellow"
                            : isActive
                              ? "font-bold text-hw-green"
                              : "text-hw-foreground",
                        )}
                      >
                        {category.name}
                        {category.isPremium && (
                          <Image
                            src={dimon}
                            alt="Premium"
                            width={16}
                            height={12}
                            className="h-[12.44px] w-4 shrink-0"
                          />
                        )}
                      </span>
                      <CategoryBadge
                        count={category.count}
                        isPremium={category.isPremium}
                      />
                    </Link>
                  </li>
                  );
                })}
          </ul>

          {showCatPager && (
            <div className="flex h-[39px] items-center justify-between border-t-[length:var(--lp-panel-divider-thin)] border-hw-line px-[10px]">
              <button
                type="button"
                aria-label="Previous categories"
                disabled={safeCatPage === 0}
                onClick={() => setCatPage((p) => Math.max(0, p - 1))}
                className="grid size-7 place-items-center rounded-md text-hw-foreground/60 transition-colors hover:text-hw-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-[length:var(--lp-panel-item)] font-medium leading-[17px] tabular-nums text-hw-foreground/60">
                {safeCatPage + 1} / {totalCatPages}
              </span>
              <button
                type="button"
                aria-label="Next categories"
                disabled={safeCatPage >= totalCatPages - 1}
                onClick={() =>
                  setCatPage((p) => Math.min(totalCatPages - 1, p + 1))
                }
                className="grid size-7 place-items-center rounded-md text-hw-foreground/60 transition-colors hover:text-hw-foreground disabled:cursor-not-allowed disabled:opacity-40"
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
