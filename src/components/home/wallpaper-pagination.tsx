"use client";

import { cn } from "@/lib/utils";

interface WallpaperPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Show Figma placeholder layout when real data has too few pages (design preview). */
  preview?: boolean;
}

/** Matches the Figma SVG export: 1–9, ellipsis, 10, with page 1 active. */
const PREVIEW_PAGES: (number | "gap")[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, "gap", 100,
];

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
  preview = false,
}: WallpaperPaginationProps) {
  if (!preview && totalPages <= 1) return null;

  const pages = preview ? PREVIEW_PAGES : buildPages(currentPage, totalPages);
  const activePage = preview ? 1 : currentPage;
  const lastPage = preview ? 100 : totalPages;

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
            onClick={() => !preview && onPageChange(page)}
            className={cn(
              "flex h-[var(--lp-pagination-h)] min-w-[var(--lp-pagination-w)] items-center justify-center rounded-[var(--lp-pagination-radius)] px-[var(--lp-pagination-px)] text-[length:var(--lp-pagination-font)] leading-none transition-colors",
              activePage === page
                ? "bg-[#33373A] font-semibold text-white"
                : "bg-[#222426] font-medium text-white hover:bg-[#33373A]",
              preview && "cursor-default",
            )}
            aria-current={activePage === page ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() =>
          !preview && onPageChange(Math.min(activePage + 1, lastPage))
        }
        disabled={!preview && activePage >= lastPage}
        className={cn(
          "h-[var(--lp-pagination-h)] w-[var(--lp-pagination-next-w)] rounded-[var(--lp-pagination-radius)] bg-[#222426] text-[length:var(--lp-pagination-font)] font-medium leading-none text-white transition-colors hover:bg-[#33373A] disabled:cursor-not-allowed disabled:opacity-50",
          preview && "cursor-default",
        )}
      >
        Next »
      </button>
    </nav>
  );
}
