"use client";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPage: (p: number) => void;
  onPageSize: (n: number) => void;
  pageSizeOptions?: number[];
  noun?: string;
}

/** Reusable pagination + page-size selector (admin theme). */
export function Pagination({
  page,
  pageSize,
  total,
  onPage,
  onPageSize,
  pageSizeOptions = [10, 25, 50],
  noun = "items",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  const pages: (number | "…")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  const numBtn =
    "grid h-8 min-w-8 place-items-center rounded-md border px-2 text-sm transition-colors";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-sm text-[var(--text2)]">
      <span>
        Showing {start} to {end} of {total} {noun}
      </span>
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => onPageSize(Number(e.target.value))}
            className="appearance-none rounded-md border border-[var(--border)] bg-[var(--bg3)] py-1.5 pl-3 pr-8 text-sm text-[var(--text)] outline-none"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
          />
        </div>

        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className={`${numBtn} border-[var(--border)] text-[var(--text)] disabled:opacity-40`}
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-1">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPage(p)}
              className={`${numBtn} ${
                p === page
                  ? "border-[var(--brand)] bg-[var(--brand)] font-semibold text-black"
                  : "border-[var(--border)] text-[var(--text)] hover:border-[var(--brand)]"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className={`${numBtn} border-[var(--border)] text-[var(--text)] disabled:opacity-40`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
