"use client";

import { cn } from "@/lib/utils";

interface WallpaperPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const WINDOW = 7;

/** Build a windowed list of page numbers (and gap markers) centered on the current page. */
function buildPages(currentPage: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= WINDOW) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages]);
  const side = Math.floor((WINDOW - 2) / 2);
  for (let p = currentPage - side; p <= currentPage + side; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("gap");
    result.push(p);
    prev = p;
  }
  return result;
}

export function WallpaperPagination({
  currentPage,
  totalPages,
  onPageChange,
}: WallpaperPaginationProps) {
  // Always show pagination (even for a single page of tag/filter results),
  // so the control doesn't disappear when there are few wallpapers.
  const pagesTotal = Math.max(1, totalPages || 1);
  const activePage = Math.min(Math.max(1, currentPage), pagesTotal);
  const pages = buildPages(activePage, pagesTotal);

  const btnBase =
    "flex h-[var(--lp-pagination-h)] items-center justify-center rounded-[var(--lp-pagination-radius)] text-[16px] leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 lg:text-[length:var(--lp-pagination-font)]";

  // Light: idle light-gray / selected charcoal. Dark: keep existing charcoal buttons.
  const btnIdle =
    "bg-[#eeeeee] font-medium text-[#555555] hover:bg-[#e0e0e0] dark:bg-[#222426] dark:text-white dark:hover:bg-[#33373A]";
  const btnActive =
    "bg-[#333333] font-semibold text-white dark:bg-[#33373A]";

  return (
    <nav
      className="flex flex-wrap items-center justify-start gap-[var(--lp-pagination-gap)] pt-[var(--lp-grid-to-pagination)] lg:justify-center"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(activePage - 1, 1))}
        disabled={activePage <= 1}
        className={cn(
          btnBase,
          btnIdle,
          "min-w-[var(--lp-pagination-next-w)] px-4",
        )}
      >
        « Previous
      </button>
      {pages.map((page, index) =>
        page === "gap" ? (
          <span
            key={`gap-${index}`}
            className={cn(
              btnBase,
              "min-w-[var(--lp-pagination-w)] bg-[#eeeeee] font-medium text-[#555555] dark:bg-[#222426] dark:text-white",
            )}
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              btnBase,
              "min-w-[var(--lp-pagination-w)] px-[var(--lp-pagination-px)]",
              activePage === page ? btnActive : btnIdle,
            )}
            aria-current={activePage === page ? "page" : undefined}
          >
            {page}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(activePage + 1, pagesTotal))}
        disabled={activePage >= pagesTotal}
        className={cn(
          btnBase,
          btnIdle,
          "min-w-[var(--lp-pagination-next-w)] px-4",
        )}
      >
        Next »
      </button>
    </nav>
  );
}
