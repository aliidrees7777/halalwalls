"use client";
import {
  Eye,
  Pencil,
  Pause,
  Play,
  Trash2,
  MoreVertical,
} from "lucide-react";
import type { ActionDef, Row } from "./types";

/** Reusable status badge — pill + dot, coloured from the status text (matches .pend-tag). */
const STATUS_STYLES: Record<string, { text: string; bg: string }> = {
  active: { text: "var(--brand)", bg: "rgba(5,223,139,0.10)" },
  approved: { text: "var(--brand)", bg: "rgba(5,223,139,0.10)" },
  paused: { text: "var(--warning)", bg: "rgba(245,158,11,0.10)" },
  pending: { text: "var(--warning)", bg: "rgba(245,158,11,0.10)" },
  rejected: { text: "var(--danger)", bg: "rgba(239,68,68,0.10)" },
  inactive: { text: "var(--text2)", bg: "rgba(142,155,160,0.10)" },
};

export function StatusBadge({ value }: { value: string }) {
  const s = STATUS_STYLES[String(value).toLowerCase()] ?? STATUS_STYLES.inactive;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[0.68rem] font-bold"
      style={{ color: s.text, background: s.bg }}
    >
      <span className="size-[5px] rounded-full" style={{ background: s.text }} />
      {value}
    </span>
  );
}

/** Reusable per-row actions (matches .aapprove/.areject/.amore sizing). */
export function RowActions<T extends Row>({
  actions,
  row,
}: {
  actions: ActionDef<T>[];
  row: T;
}) {
  const box =
    "grid size-[28px] place-items-center rounded-[6px] border transition-colors";
  return (
    <div className="flex items-center justify-end gap-[5px]">
      {actions.map((a, i) => {
        const active = a.isActive ? a.isActive(row) : true;
        let cls = "";
        let icon = null;
        if (a.type === "view") {
          cls = `${box} border-[var(--border2)] bg-[var(--bg3)] text-[var(--text2)] hover:bg-[var(--bg4)] hover:text-[var(--text)]`;
          icon = <Eye size={13} />;
        } else if (a.type === "edit") {
          cls = `${box} border-[var(--border2)] bg-[var(--bg3)] text-[var(--text2)] hover:bg-[var(--bg4)] hover:text-[var(--text)]`;
          icon = <Pencil size={13} />;
        } else if (a.type === "toggle") {
          cls = active
            ? `${box} border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.10)] text-[var(--warning)]`
            : `${box} border-[rgba(5,223,139,0.25)] bg-[rgba(5,223,139,0.10)] text-[var(--brand)]`;
          icon = active ? <Pause size={13} /> : <Play size={13} />;
        } else if (a.type === "delete") {
          cls = `${box} border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white`;
          icon = <Trash2 size={13} />;
        } else {
          // more → borderless dots
          cls = "grid size-[28px] place-items-center rounded-[6px] text-[var(--text3)] transition-colors hover:text-[var(--text)]";
          icon = <MoreVertical size={15} />;
        }
        return (
          <button
            key={i}
            type="button"
            title={a.title ?? a.type}
            onClick={() => a.onClick?.(row)}
            className={cls}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
