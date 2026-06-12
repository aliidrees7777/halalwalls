"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/use-catalog";
import { cn } from "@/lib/utils";

/**
 * Desktop primary navigation (shared by the home + download headers).
 * - Explore / Resolutions: static browse links.
 * - Categories: LIVE from the API, paginated 10 per page with prev/next arrows
 *   (so it scales to hundreds of categories).
 * Every menu item is a real <Link> (reliable navigation + prefetch).
 */
interface NavLink {
  label: string;
  href: string;
}

const EXPLORE: NavLink[] = [
  { label: "Latest", href: "/?category=latest" },
  { label: "Most Popular", href: "/?category=popular" },
  { label: "Random Picks", href: "/?category=random" },
  { label: "Live Wallpapers", href: "/?category=live" },
];

// No resolution-based grid filter on the backend yet — these browse the latest.
const RESOLUTIONS: NavLink[] = [
  { label: "1920×1080", href: "/?category=latest" },
  { label: "2560×1440", href: "/?category=latest" },
  { label: "3840×2160 (4K)", href: "/?category=latest" },
  { label: "Mobile HD", href: "/?category=latest" },
];

const CATEGORIES_PER_PAGE = 10;

const triggerClass =
  "flex items-center gap-0.5 rounded-md px-3 py-2 text-[13px] text-hw-muted transition-colors hover:text-hw-foreground";
const itemClass =
  "text-sm text-hw-muted focus:bg-hw-surface focus:text-hw-foreground";

function StaticDropdown({ label, items }: { label: string; items: NavLink[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClass}>
        {label}
        <ChevronDown className="size-3.5 opacity-80" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px] border-hw-border bg-hw-card">
        {items.map((it) => (
          <DropdownMenuItem key={it.label} render={<Link href={it.href} />} className={itemClass}>
            {it.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CategoriesDropdown() {
  const { categories } = useCategories();
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(categories.length / CATEGORIES_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * CATEGORIES_PER_PAGE;
  const slice = categories.slice(start, start + CATEGORIES_PER_PAGE);
  const showPager = categories.length > CATEGORIES_PER_PAGE;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClass}>
        Categories
        <ChevronDown className="size-3.5 opacity-80" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px] border-hw-border bg-hw-card">
        {slice.map((c) => (
          <DropdownMenuItem
            key={c.id}
            render={<Link href={`/?category=${c.slug}`} />}
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
  return (
    <nav className={cn("hidden items-center gap-0.5 lg:flex", className)} aria-label="Primary">
      <StaticDropdown label="Explore" items={EXPLORE} />
      <CategoriesDropdown />
      <StaticDropdown label="Resolutions" items={RESOLUTIONS} />
      <Link href="/upload" className={triggerClass}>
        Upload
      </Link>
      <Link
        href="/premium"
        className="rounded-md px-3 py-2 text-[13px] font-medium text-hw-yellow transition-opacity hover:opacity-90"
      >
        Premium
      </Link>
    </nav>
  );
}
