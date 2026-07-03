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
  /** Column key used as the card heading. */
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
  const titleCol =
    columns.find((c) => c.key === titleKey) ?? columns.find((c) => c.key === "title") ?? columns[0];
  const metaCols = columns.filter((c) => c.key !== titleCol?.key && !c.key.match(/^preview$/));

  if (rows.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--text2)]">No results found.</div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
      {rows.map((row) => (
        <div
          key={rowId(row)}
          className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] transition-colors hover:border-[var(--border2)]"
        >
          {image ? (
            <div className="aspect-[16/10] w-full overflow-hidden bg-[var(--bg4)]">
              {image(row) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image(row)} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
          ) : null}
          <div className="p-3">
            {titleCol ? (
              <div className="mb-2">
                {titleCol.cell ? titleCol.cell(row) : <div className="wtitle">{String(row[titleCol.key] ?? "")}</div>}
              </div>
            ) : null}
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
      ))}
    </div>
  );
}
