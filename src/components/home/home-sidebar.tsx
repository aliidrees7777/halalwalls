"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trendingTopics } from "@/data/sidebar";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import { OurAppPanel } from "@/components/home/our-app-panel";
import { SidebarCollapsible } from "@/components/shared/sidebar-collapsible";
import { useCategories, useResolutions, useTags } from "@/hooks/use-catalog";
import { buildFilterHref, normalizeResolution } from "@/lib/filter-url";
import { cn } from "@/lib/utils";

function PremiumDiamond({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="9"
      viewBox="0 0 12 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M5.30357 0H2.00893L3.21429 1.8871L5.30357 0Z" fill="currentColor" />
      <path d="M2.89375 1.95968L1.6875 0.0725806L0 1.95968H2.89375Z" fill="currentColor" />
      <path d="M7.875 1.95968H3.69643L5.78571 0.0725806L7.875 1.95968Z" fill="currentColor" />
      <path d="M9.5625 0H6.26786L8.27679 1.81452L9.5625 0Z" fill="currentColor" />
      <path d="M9.88393 0.145161L8.59821 1.95968H11.5714L9.88393 0.145161Z" fill="currentColor" />
      <path d="M3.05357 2.32258H0L5.22321 8.56452L3.05357 2.32258Z" fill="currentColor" />
      <path d="M11.5714 2.32258H8.51786L6.34821 8.56452L11.5714 2.32258Z" fill="currentColor" />
      <path d="M8.11607 2.32258H3.45536L5.78571 9L8.11607 2.32258Z" fill="currentColor" />
    </svg>
  );
}

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
        "flex h-[var(--lp-chip-h)] min-w-0 items-center justify-center rounded-[var(--lp-chip-radius)] border-[length:var(--lp-chip-border)] border-hw-line bg-transparent px-1 text-center text-[11px] font-medium uppercase leading-none text-hw-foreground transition-colors",
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

/** Display tag as Title Case ("anime" → "Anime"). */
function formatTrendingTag(tag: string) {
  return tag
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

interface HomeSidebarProps {
  /** When provided, the third panel renders these wallpaper tags ("Tags #")
   *  instead of the "Trending" list (wallpaper detail page variant). */
  tags?: string[];
  /** Slug of the category to highlight as active (wallpaper detail page). */
  activeCategory?: string;
}

export function HomeSidebar({
  tags,
  activeCategory,
}: HomeSidebarProps = {}) {
  const [catPage, setCatPage] = useState(0);
  const { categories, loading } = useCategories();
  const res = useResolutions();
  const catalogTags = useTags();
  const searchParams = useSearchParams();
  const activeResolution = searchParams.get("resolution") || "";
  const activeTag = (searchParams.get("tag") || "").trim().toLowerCase();
  // Prefer explicit prop (detail page), else URL ?category= (home filters).
  const selectedCategory =
    activeCategory || searchParams.get("category") || "";

  // Trending = top 6 most-used tags from the API; fall back to static list.
  const trending =
    catalogTags.length > 0
      ? [...catalogTags]
          .sort((a, b) => b.count - a.count)
          .slice(0, 6)
          .map((t) => t.tag)
      : trendingTopics.slice(0, 6);

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

      <OurAppPanel />

      {tags ? (
        <SidebarPanel title="Tags #">
          <ul>
            {tags.map((tag, index) => {
              const isActive = activeTag === tag.trim().toLowerCase();
              return (
              <li
                key={tag}
                className={cn(index > 0 && "border-t-[length:var(--lp-panel-divider-thin)] border-hw-line")}
              >
                <Link
                  href={`/?tag=${encodeURIComponent(tag)}`}
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
            {trending.map((topic, index) => {
              const isActive = activeTag === topic.trim().toLowerCase();
              return (
              <li
                key={topic}
                className={cn(index > 0 && "border-t-[length:var(--lp-panel-divider-thin)] border-hw-line")}
              >
                <Link
                  href={buildFilterHref(searchParams, { tag: topic })}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block px-[11px] py-[11px] text-[length:var(--lp-panel-item)] font-medium leading-[17px] transition-colors hover:text-hw-green",
                    isActive
                      ? "bg-hw-green/10 font-bold text-hw-green"
                      : "text-hw-foreground",
                  )}
                >
                  {formatTrendingTag(topic)}
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
        iconSrcLight="/category-icon-lightmode.svg"
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
                          <PremiumDiamond className="h-[12.44px] w-4 shrink-0" />
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
