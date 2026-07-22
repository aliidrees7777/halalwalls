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
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-[var(--lp-pagination-gap)] pt-[var(--lp-grid-to-pagination)]"
      aria-label="Pagination"
    >
      {pages.map((page, index) =>
        page === "gap" ? (
          <span
            key={`gap-${index}`}
            className="flex h-[var(--lp-pagination-h)] min-w-[var(--lp-pagination-w)] items-center justify-center rounded-[var(--lp-pagination-radius)] bg-hw-bg text-[length:var(--lp-pagination-font)] font-medium text-white"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              "flex h-[var(--lp-pagination-h)] min-w-[var(--lp-pagination-w)] items-center justify-center rounded-[var(--lp-pagination-radius)] px-[var(--lp-pagination-px)] text-[length:var(--lp-pagination-font)] leading-none transition-colors",
              currentPage === page
                ? "bg-[#33373A] font-semibold text-white"
                : "bg-[#222426] font-medium text-white hover:bg-[#33373A]",
            )}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage >= totalPages}
        className="h-[var(--lp-pagination-h)] w-[var(--lp-pagination-next-w)] rounded-[var(--lp-pagination-radius)] bg-[#222426] text-[length:var(--lp-pagination-font)] font-medium leading-none text-white transition-colors hover:bg-[#33373A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next »
      </button>
    </nav>
  );
}
