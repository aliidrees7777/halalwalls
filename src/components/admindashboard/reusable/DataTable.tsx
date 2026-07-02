"use client";
import { RowActions } from "./cells";
import type { ActionDef, ColumnDef, Row } from "./types";

interface DataTableProps<T extends Row> {
  columns: ColumnDef<T>[];
  rows: T[];
  actions?: ActionDef<T>[];
  rowId: (row: T) => string;
  showIndex?: boolean;
  /** First row's global number (page offset) for the # column. */
  startIndex?: number;
}

const alignCls = { left: "text-left", center: "text-center", right: "text-right" };

/**
 * Reusable dynamic table. Column with a `cell` renderer → image/badge/stacked
 * text; without one → `row[key]`. Optional leading # column and trailing Actions
 * column. Header/row styling matches the dashboard table (thead th → --text3).
 */
export function DataTable<T extends Row>({
  columns,
  rows,
  actions,
  rowId,
  showIndex,
  startIndex = 0,
}: DataTableProps<T>) {
  const colCount = columns.length + (actions ? 1 : 0) + (showIndex ? 1 : 0);
  const thCls =
    "px-[10px] pb-[10px] text-[0.65rem] font-bold uppercase tracking-[0.06em] text-[var(--text3)] whitespace-nowrap";
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {showIndex ? <th className={`${thCls} text-left`}>#</th> : null}
            {columns.map((c) => (
              <th
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className={`${thCls} ${alignCls[c.align ?? "left"]}`}
              >
                {c.header}
              </th>
            ))}
            {actions ? <th className={`${thCls} text-right`}>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={rowId(row)}
              className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-white/[0.018]"
            >
              {showIndex ? (
                <td className="px-[10px] py-[11px] align-middle text-[var(--text3)]">
                  {startIndex + i + 1}
                </td>
              ) : null}
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-[10px] py-[11px] align-middle text-[var(--text)] ${alignCls[c.align ?? "left"]}`}
                >
                  {c.cell ? c.cell(row) : String(row[c.key] ?? "")}
                </td>
              ))}
              {actions ? (
                <td className="px-[10px] py-[11px] text-right">
                  <RowActions actions={actions} row={row} />
                </td>
              ) : null}
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="px-4 py-12 text-center text-[var(--text2)]">
                No results found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
