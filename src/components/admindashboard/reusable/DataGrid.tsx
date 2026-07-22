"use client";
import { RowActions } from "./cells";
import type { ActionDef, ColumnDef, Row } from "./types";

interface DataGridProps<T extends Row> {
  columns: ColumnDef<T>[];
  rows: T[];
  actions?: ActionDef<T>[];
  rowId: (row: T) => string;
  /** Full-width cover image URL for the card. */
  image?: (row: T) => string;
  /** Column key OR raw row field used as the card heading. */
  titleKey?: string;
}

/**
 * Reusable card/grid view — the "grid" half of the list/grid toggle. Renders a
 * responsive card per row: a cover image (via `image`), the title column as the
 * heading, the remaining columns as label/value rows, and the same row actions.
 */
export function DataGrid<T extends Row>({
  columns,
  rows,
  actions,
  rowId,
  image,
  titleKey,
}: DataGridProps<T>) {
  const titleCol = titleKey
    ? columns.find((c) => c.key === titleKey)
    : columns.find((c) => c.key === "title");

  // When a cover image is provided, skip list-style preview/category thumb cells
  // so cards stay compact and don't stretch across "pages".
  const metaCols = columns.filter((c) => {
    if (titleCol && c.key === titleCol.key) return false;
    if (titleKey && c.key === titleKey) return false;
    if (/^preview$/.test(c.key)) return false;
    if (image && c.key === "category") return false;
    return true;
  });

  if (rows.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--text2)]">No results found.</div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {rows.map((row) => {
        const titleText =
          (titleKey && row[titleKey] != null ? String(row[titleKey]) : null) ||
          (titleCol ? String(row[titleCol.key] ?? "") : "");
        const cover = image?.(row) || "";

        return (
          <div
            key={rowId(row)}
            className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] transition-colors hover:border-[var(--border2)]"
          >
            {image ? (
              <div className="aspect-[16/10] w-full overflow-hidden bg-[var(--bg4)]">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
            ) : null}
            <div className="p-3">
              <div className="mb-2">
                {titleCol?.cell && !image ? (
                  titleCol.cell(row)
                ) : (
                  <div className="wtitle">{titleText}</div>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {metaCols.map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-[var(--text3)]">{c.header}</span>
                    <span className="text-right text-[var(--text)]">
                      {c.cell ? c.cell(row) : String(row[c.key] ?? "")}
                    </span>
                  </div>
                ))}
              </div>
              {actions ? (
                <div className="mt-3 flex justify-end border-t border-[var(--border)] pt-3">
                  <RowActions actions={actions} row={row} />
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
