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
  /** Cover aspect — wallpapers landscape (default), categories square. */
  imageAspect?: "rect" | "square";
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
  imageAspect = "rect",
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
    <div
      className={
        image
          ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }
    >
      {rows.map((row) => {
        const titleText =
          (titleKey && row[titleKey] != null ? String(row[titleKey]) : null) ||
          (titleCol ? String(row[titleCol.key] ?? "") : "");
        const cover = image?.(row) || "";

        return (
          <div
            key={rowId(row)}
            className="min-w-0 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] transition-colors hover:border-[var(--border2)]"
          >
            {image ? (
              <div
                className="w-full overflow-hidden bg-[var(--bg4)]"
                style={{
                  aspectRatio: imageAspect === "square" ? "1 / 1" : "16 / 10",
                }}
              >
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : null}
              </div>
            ) : null}
            <div className="min-w-0 p-3">
              <div className="mb-2 min-w-0">
                {titleCol?.cell && !image ? (
                  titleCol.cell(row)
                ) : (
                  <div className="wtitle break-words">{titleText}</div>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {metaCols.map((c) => (
                  <div key={c.key} className="flex items-start justify-between gap-3 text-xs">
                    <span className="shrink-0 text-[var(--text3)]">{c.header}</span>
                    <span className="min-w-0 max-w-[70%] text-right break-words text-[var(--text)]">
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
