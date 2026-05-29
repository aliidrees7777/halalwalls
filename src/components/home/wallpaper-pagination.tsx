"use client";

import { cn } from "@/lib/utils";

interface WallpaperPaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
}

export function WallpaperPagination({
  currentPage,
  onPageChange,
  totalPages = 100,
}: WallpaperPaginationProps) {
  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1 py-6"
      aria-label="Pagination"
    >
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={cn(
            "flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
            currentPage === page
              ? "bg-[#2a3038] text-hw-foreground"
              : "bg-hw-card text-hw-muted hover:bg-hw-surface hover:text-hw-foreground"
          )}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <span className="px-1 text-hw-muted">...</span>
      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        className="flex size-9 items-center justify-center rounded-lg bg-hw-card text-sm text-hw-muted transition-colors hover:bg-hw-surface hover:text-hw-foreground"
      >
        {totalPages}
      </button>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        className="ml-1 rounded-lg bg-hw-card px-3 py-2 text-sm text-hw-muted transition-colors hover:bg-hw-surface hover:text-hw-foreground"
      >
        Next »
      </button>
    </nav>
  );
}
