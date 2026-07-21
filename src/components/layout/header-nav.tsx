"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories, useResolutions } from "@/hooks/use-catalog";
import { buildFilterHref, normalizeResolution } from "@/lib/filter-url";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
/**
 * Desktop primary navigation (shared by the home + download headers).
 * Every entry MERGES into the current filters (combine), targeting the homepage:
 * - Explore → ?sort (browse mode)
 * - Categories → ?category (LIVE, paginated 10/page with prev/next arrows)
 * - Resolutions → ?resolution (native resolution filter)
 * Items are real <Link>s for reliable navigation.
 */
const EXPLORE = [
  { label: "Latest", update: { sort: "latest" } },
  { label: "Live Walls", update: { sort: "live" } },
  { label: "Random", update: { sort: "random" } },
  { label: "Popular", update: { sort: "popular" } },
];

const RESOLUTION_LABELS = [
  "1920×1080",
  "2560×1440",
  "3840×2160 (4K)",
  "1080×2400 (Mobile)",
];

const CATEGORIES_PER_PAGE = 10;

const triggerClass =
  "flex items-center gap-0.5 rounded-md px-3 py-2 text-[18px] transition-colors text-hw-foreground font-medium";
const itemClass =
  "text-[18px] text-hw-muted focus:bg-hw-surface focus:text-hw-foreground font-medium";
const itemActiveClass =
  "bg-hw-green/10 font-bold text-hw-green focus:bg-hw-green/15 focus:text-hw-green";

function LinkDropdown({
  label,
  items,
  activeHref,
}: {
  label: string;
  items: { label: string; href: string; active?: boolean }[];
  activeHref?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(triggerClass, activeHref && "text-hw-green")}
      >
        {label}
        <ChevronDown className="size-6 opacity-80" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[190px] border-hw-border bg-hw-card"
      >
        {items.map((it) => (
          <DropdownMenuItem
            key={it.label}
            render={<Link href={it.href} />}
            className={cn(itemClass, it.active && itemActiveClass)}
          >
            {it.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CategoriesDropdown({
  searchParams,
}: {
  searchParams: ReturnType<typeof useSearchParams>;
}) {
  const { categories } = useCategories();
  const [page, setPage] = useState(0);
  const activeCategory = searchParams.get("category") || "";

  const totalPages = Math.max(
    1,
    Math.ceil(categories.length / CATEGORIES_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * CATEGORIES_PER_PAGE;
  const slice = categories.slice(start, start + CATEGORIES_PER_PAGE);
  const showPager = categories.length > CATEGORIES_PER_PAGE;
  const activeName = categories.find((c) => c.slug === activeCategory)?.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(triggerClass, activeCategory && "text-hw-green")}
      >
        {activeName || "Categories"}
        <ChevronDown className="size-6 opacity-80" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[200px] border-hw-border bg-hw-card"
      >
        {slice.map((c) => {
          const isActive = activeCategory === c.slug;
          return (
            <DropdownMenuItem
              key={c.id}
              render={
                <Link
                  href={buildFilterHref(searchParams, { category: c.slug })}
                />
              }
              className={cn(itemClass, isActive && itemActiveClass)}
            >
              {c.name}
            </DropdownMenuItem>
          );
        })}

        {showPager && (
          <>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between px-1.5 py-1">
              <button
                type="button"
                aria-label="Previous categories"
                disabled={safePage === 0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPage((p) => Math.max(0, p - 1));
                }}
                className="grid size-7 place-items-center rounded-md text-hw-muted transition-colors hover:bg-hw-surface hover:text-hw-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-[11px] tabular-nums text-hw-muted">
                {safePage + 1} / {totalPages}
              </span>
              <button
                type="button"
                aria-label="Next categories"
                disabled={safePage >= totalPages - 1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPage((p) => Math.min(totalPages - 1, p + 1));
                }}
                className="grid size-7 place-items-center rounded-md text-hw-muted transition-colors hover:bg-hw-surface hover:text-hw-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function HeaderNav({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const { openAuthModal, user } = useAuth();
  const activeSort = searchParams.get("sort") || "latest";
  const activeResolution = searchParams.get("resolution") || "";

  const exploreItems = EXPLORE.map((e) => ({
    label: e.label,
    href: buildFilterHref(searchParams, e.update),
    active: activeSort === e.update.sort,
  }));
  // Live resolution catalog (admin-managed); falls back to the static list.
  const res = useResolutions();
  const resLabels = [...(res.desktop ?? []), ...(res.mobile ?? [])];
  const resolutionItems = (resLabels.length ? resLabels : RESOLUTION_LABELS).map(
    (l) => {
      const key = normalizeResolution(l);
      return {
        label: l,
        href: buildFilterHref(searchParams, { resolution: key }),
        active: activeResolution === key,
      };
    },
  );
  const activeResLabel = resolutionItems.find((r) => r.active)?.label;

  return (
    <nav
      className={cn("hidden items-center gap-0.5 lg:flex", className)}
      aria-label="Primary"
    >
      <LinkDropdown label="Explore" items={exploreItems} />
      <CategoriesDropdown searchParams={searchParams} />
      <LinkDropdown
        label={activeResLabel || "Resolutions"}
        items={resolutionItems}
        activeHref={!!activeResolution}
      />
      <Link href="/upload" className={triggerClass}>
        Upload
      </Link>
      <button
        type="button"
        onClick={() => openAuthModal("premium")}
        className="rounded-md px-3 py-2 text-[18px] font-medium text-hw-yellow transition-opacity hover:opacity-90"
      >
        {user?.isPremium && user.subscriptionPlan !== "lifetime"
          ? "Upgrade"
          : "Premium"}
      </button>
    </nav>
  );
}
