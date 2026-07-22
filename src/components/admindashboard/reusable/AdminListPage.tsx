"use client";
import { useEffect, useMemo, useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { StatCards } from "./StatCards";
import { Toolbar } from "./Toolbar";
import { DataTable } from "./DataTable";
import { DataGrid } from "./DataGrid";
import { Pagination } from "./Pagination";
import type { ListPageConfig, Row, StatCardDef } from "./types";

/**
 * One reusable admin list page. Give it a ListPageConfig and it renders the
 * header + breadcrumb + actions, the stat cards, the toolbar (search / filters /
 * sort / view), the dynamic table and pagination.
 *
 * Two data modes:
 *  • Static  — `config.data` + `config.stats`; search/filter/sort/paginate run
 *    client-side (used by the simple mock pages).
 *  • Server  — `config.fetcher` (+ optional `config.statsFetcher`); every query
 *    hits the API with pagination/search/filter/sort. Pass `refreshKey` and bump
 *    it to force a reload after a mutation (delete/create/edit).
 */
export function AdminListPage<T extends Row>({
  config,
  refreshKey = 0,
}: {
  config: ListPageConfig<T>;
  refreshKey?: number;
}) {
  const server = !!config.fetcher;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState(config.sortOptions?.[0]?.value ?? "");
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Boxed view uses a multi-column card grid — page size must fill complete
  // rows (12/24/48), otherwise the last row looks "empty" and items spill
  // onto the next page (e.g. 10 items → 6 + 4 gap on a 6-col layout).
  const GRID_PAGE_SIZES = [12, 24, 48];
  const LIST_PAGE_SIZES = [10, 25, 50];

  const handleViewChange = (next: "list" | "grid") => {
    setView(next);
    setPage(1);
    if (next === "grid" && !GRID_PAGE_SIZES.includes(pageSize)) {
      setPageSize(12);
    } else if (next === "list" && !LIST_PAGE_SIZES.includes(pageSize)) {
      setPageSize(10);
    }
  };

  // Debounce the search box so we don't refetch on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Never strand the user on an empty page when the query narrows.
  useEffect(() => setPage(1), [debouncedSearch, filterValues, sort, pageSize]);

  // ── server data ──
  const [serverRows, setServerRows] = useState<T[]>([]);
  const [serverTotal, setServerTotal] = useState(0);
  const [loading, setLoading] = useState(server);
  const fetcher = config.fetcher;

  useEffect(() => {
    if (!fetcher) return;
    let ignore = false;
    setLoading(true);
    fetcher({ search: debouncedSearch, filters: filterValues, sort, page, pageSize })
      .then((r) => {
        if (ignore) return;
        setServerRows(r.rows);
        setServerTotal(r.total);
      })
      .catch(() => {
        if (ignore) return;
        setServerRows([]);
        setServerTotal(0);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetcher, debouncedSearch, filterValues, sort, page, pageSize, refreshKey]);

  // ── server stat cards ──
  const [fetchedStats, setFetchedStats] = useState<StatCardDef[] | null>(null);
  const statsFetcher = config.statsFetcher;
  useEffect(() => {
    if (!statsFetcher) return;
    let ignore = false;
    statsFetcher()
      .then((s) => {
        if (!ignore) setFetchedStats(s);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [statsFetcher, refreshKey]);

  // ── client-side fallback (static pages) ──
  const clientFiltered = useMemo(() => {
    if (server) return [];
    let rows = config.data ?? [];
    const q = debouncedSearch.trim().toLowerCase();
    if (q && config.searchKeys?.length) {
      rows = rows.filter((r) =>
        config.searchKeys!.some((k) =>
          String((r as Row)[k] ?? "").toLowerCase().includes(q),
        ),
      );
    }
    for (const [key, value] of Object.entries(filterValues)) {
      if (!value) continue;
      rows = rows.filter(
        (r) => String((r as Row)[key] ?? "").toLowerCase() === value.toLowerCase(),
      );
    }
    return rows;
  }, [server, config.data, config.searchKeys, debouncedSearch, filterValues]);

  const total = server ? serverTotal : clientFiltered.length;
  const rows = server
    ? serverRows
    : clientFiltered.slice((page - 1) * pageSize, page * pageSize);
  const stats = fetchedStats ?? config.stats ?? [];

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* Header + breadcrumb + actions */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{config.title}</h1>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--text2)]">
            {config.breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 ? <ChevronRight size={13} /> : null}
                <span className={i === config.breadcrumb.length - 1 ? "text-[var(--text)]" : "text-[var(--brand)]"}>
                  {b}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {config.secondaryAction ? (
            <button
              type="button"
              onClick={config.secondaryAction.onClick}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--bg4)]"
            >
              {config.secondaryAction.icon} {config.secondaryAction.label}
            </button>
          ) : null}
          {config.primaryAction ? (
            <button
              type="button"
              onClick={config.primaryAction.onClick}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-black transition-[filter] hover:brightness-95"
            >
              <Plus size={16} /> {config.primaryAction.label}
            </button>
          ) : null}
        </div>
      </div>

      {stats.length ? <StatCards stats={stats} /> : null}

      <div className="mt-6 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-4">
        <Toolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder={config.searchPlaceholder}
          filters={config.filters}
          filterValues={filterValues}
          onFilter={(key, value) =>
            setFilterValues((prev) => ({ ...prev, [key]: value }))
          }
          sortOptions={config.sortOptions}
          sort={sort}
          onSort={setSort}
          view={view}
          onView={handleViewChange}
        />

        <div className="relative mt-4">
          {view === "grid" ? (
            <DataGrid
              columns={config.columns}
              rows={rows}
              actions={config.actions}
              rowId={config.rowId}
              image={config.gridImage}
              titleKey={config.gridTitleKey}
            />
          ) : (
            <DataTable
              columns={config.columns}
              rows={rows}
              actions={config.actions}
              rowId={config.rowId}
              showIndex={config.showIndex}
              startIndex={(page - 1) * pageSize}
            />
          )}
          {loading ? (
            <div className="absolute inset-0 grid place-items-center bg-[var(--bg2)]/60 text-sm text-[var(--text2)]">
              {config.loadingText ?? "Loading…"}
            </div>
          ) : null}
        </div>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPage={setPage}
          onPageSize={(n) => {
            setPageSize(n);
            setPage(1);
          }}
          pageSizeOptions={view === "grid" ? GRID_PAGE_SIZES : LIST_PAGE_SIZES}
          noun={config.title.toLowerCase()}
        />
      </div>
    </div>
  );
}
