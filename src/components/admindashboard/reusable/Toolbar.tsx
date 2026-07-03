"use client";
import { Search, Filter, ChevronDown, LayoutGrid, List } from "lucide-react";
import type { FilterDef, SortOption } from "./types";

interface ToolbarProps {
  search: string;
  onSearch: (v: string) => void;
  searchPlaceholder?: string;
  filters?: FilterDef[];
  filterValues: Record<string, string>;
  onFilter: (key: string, value: string) => void;
  sortOptions?: SortOption[];
  sort: string;
  onSort: (v: string) => void;
  view: "list" | "grid";
  onView: (v: "list" | "grid") => void;
}

const selectCls =
  "appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg3)] py-2 pl-3 pr-9 text-sm text-[var(--text)] outline-none focus:border-[var(--brand)]";

/** Reusable toolbar: search + config-driven filter dropdowns + sort + view toggle. */
export function Toolbar({
  search,
  onSearch,
  searchPlaceholder = "Search…",
  filters,
  filterValues,
  onFilter,
  sortOptions,
  sort,
  onSort,
  view,
  onView,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search (reusable) — fixed-ish width so filters sit left, sort/toggle go right */}
      <div className="relative w-full sm:w-[260px] sm:shrink-0">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text2)]"
        />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg3)] py-2 pl-9 pr-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text3)] focus:border-[var(--brand)]"
        />
      </div>

      {/* Filter dropdowns (reusable, config-driven) */}
      {filters?.map((f) => (
        <div key={f.key} className="relative">
          <select
            value={filterValues[f.key] ?? ""}
            onChange={(e) => onFilter(f.key, e.target.value)}
            className={selectCls}
          >
            <option value="">{f.placeholder}</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text2)]"
          />
        </div>
      ))}

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg3)] px-3 py-2 text-sm text-[var(--text)] hover:border-[var(--brand)]"
      >
        <Filter size={15} /> Filter
      </button>

      <div className="ml-auto flex items-center gap-3">
        {sortOptions?.length ? (
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value)}
              className={selectCls}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  Sort by: {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text2)]"
            />
          </div>
        ) : null}

        <div className="flex overflow-hidden rounded-lg border border-[var(--border)]">
          <button
            type="button"
            onClick={() => onView("grid")}
            className={`grid size-9 place-items-center ${
              view === "grid" ? "bg-[var(--brand-dim)] text-[var(--brand)]" : "text-[var(--text2)] hover:text-[var(--text)]"
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            onClick={() => onView("list")}
            className={`grid size-9 place-items-center ${
              view === "list" ? "bg-[var(--brand-dim)] text-[var(--brand)]" : "text-[var(--text2)] hover:text-[var(--text)]"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
