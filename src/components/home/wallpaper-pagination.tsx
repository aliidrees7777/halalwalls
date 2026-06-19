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
      className="flex flex-wrap items-center justify-center gap-1 py-10"
      aria-label="Pagination"
    >
      {pages.map((page, index) =>
        page === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-hw-muted">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              "flex lg:w-[54px] lg:h-[53px]  w-[32px]  h-[32px] items-center justify-center rounded-sm lg:text-2xl text-base font-medium transition-colors",
              currentPage === page
                ? "bg-[#33373A] font-semibold text-white"
                : "bg-hw-card text-[#ffffff] hover:bg-hw-surface hover:text-hw-foreground"
            )}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage >= totalPages}
        className="ml-1 rounded-sm bg-hw-card lg:w-[112px]  lg:h-[54px] h-[32px] w-[73px] lg:text-2xl text-base font-medium text-[#ffffff] transition-colors hover:bg-hw-surface hover:text-hw-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next »
      </button>
    </nav>
  );
}
