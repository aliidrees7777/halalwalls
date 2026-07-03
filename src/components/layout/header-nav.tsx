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
  { label: "Latest Wallpapers", update: { sort: "latest" } },
  { label: "Top Rated", update: { sort: "popular" } },
  { label: "Editor's Picks", update: { sort: "popular" } },
  { label: "New Uploads", update: { sort: "latest" } },
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

function LinkDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClass}>
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
            className={itemClass}
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

  const totalPages = Math.max(
    1,
    Math.ceil(categories.length / CATEGORIES_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * CATEGORIES_PER_PAGE;
  const slice = categories.slice(start, start + CATEGORIES_PER_PAGE);
  const showPager = categories.length > CATEGORIES_PER_PAGE;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClass}>
        Categories
        <ChevronDown className="size-6 opacity-80" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[200px] border-hw-border bg-hw-card"
      >
        {slice.map((c) => (
          <DropdownMenuItem
            key={c.id}
            render={
              <Link
                href={buildFilterHref(searchParams, { category: c.slug })}
              />
            }
            className={itemClass}
          >
            {c.name}
          </DropdownMenuItem>
        ))}

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
  const { openAuthModal } = useAuth();
  const exploreItems = EXPLORE.map((e) => ({
    label: e.label,
    href: buildFilterHref(searchParams, e.update),
  }));
  // Live resolution catalog (admin-managed); falls back to the static list.
  const res = useResolutions();
  const resLabels = [...(res.desktop ?? []), ...(res.mobile ?? [])];
  const resolutionItems = (resLabels.length ? resLabels : RESOLUTION_LABELS).map((l) => ({
    label: l,
    href: buildFilterHref(searchParams, { resolution: normalizeResolution(l) }),
  }));

  return (
    <nav
      className={cn("hidden items-center gap-0.5 lg:flex", className)}
      aria-label="Primary"
    >
      <LinkDropdown label="Explore" items={exploreItems} />
      <CategoriesDropdown searchParams={searchParams} />
      <LinkDropdown label="Resolutions" items={resolutionItems} />
      <Link href="/upload" className={triggerClass}>
        Upload
      </Link>
      {/* <Link
        href="/premium"
        className="rounded-md px-3 py-2 text-[18px] font-medium text-hw-yellow transition-opacity hover:opacity-90"
      >
        Premium
      </Link> */}
      <button
        onClick={() => openAuthModal("premium")}
        className="rounded-md px-3 py-2 text-[18px] font-medium text-hw-yellow transition-opacity hover:opacity-90"
      >
        Premium
      </button>
    </nav>
  );
}
