"use client";
import { useEffect, useMemo, useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { StatCards } from "./StatCards";
import { Toolbar } from "./Toolbar";
import { DataTable } from "./DataTable";
import { Pagination } from "./Pagination";
import type { ListPageConfig, Row } from "./types";

/**
 * One reusable admin list page. Give it a ListPageConfig and it renders the
 * header + breadcrumb + primary action, the stat cards, the toolbar (search /
 * filters / sort / view), the dynamic table and pagination — all wired. The
 * search / filter / sort / paginate logic lives here so every page gets it for
 * free.
 */
export function AdminListPage<T extends Row>({
  config,
}: {
  config: ListPageConfig<T>;
}) {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState(config.sortOptions?.[0]?.value ?? "");
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset paging when the query changes so you never land on an empty page.
  useEffect(() => setPage(1), [search, filterValues, pageSize]);

  const filtered = useMemo(() => {
    let rows = config.data;

    const q = search.trim().toLowerCase();
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
  }, [config.data, config.searchKeys, search, filterValues]);

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* Header + breadcrumb + primary action */}
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

      {/* Stat cards */}
      <StatCards stats={config.stats} />

      {/* Toolbar + table + pagination card */}
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
          onView={setView}
        />

        <div className="mt-4">
          <DataTable
            columns={config.columns}
            rows={paged}
            actions={config.actions}
            rowId={config.rowId}
            showIndex={config.showIndex}
            startIndex={(page - 1) * pageSize}
          />
        </div>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPage={setPage}
          onPageSize={setPageSize}
          noun={config.title.toLowerCase()}
        />
      </div>
    </div>
  );
}
