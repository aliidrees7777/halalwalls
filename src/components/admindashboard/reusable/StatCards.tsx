"use client";
import { cloneElement, isValidElement, type ReactElement, type CSSProperties } from "react";
import type { StatCardDef } from "./types";

// "+…" → green, "-…" → red, descriptive → default (text3).
function subColor(sub?: string): string | undefined {
  if (!sub) return undefined;
  if (sub.startsWith("+")) return "var(--brand)";
  if (sub.startsWith("-")) return "var(--danger)";
  return undefined;
}

/**
 * Reusable analytics card row — reuses the dashboard's own .sc classes so it's
 * pixel-identical to the admin theme: icon LEFT (brand-dim box, green icon),
 * then label / value (+ optional inline ▲/▼ trend) / sub line.
 */
export function StatCards({ stats }: { stats: StatCardDef[] }) {
  return (
    <div className="stats">
      {stats.map((s, i) => {
        const iconEl =
          s.accent && isValidElement(s.icon)
            ? cloneElement(s.icon as ReactElement<{ style?: CSSProperties }>, {
                style: { color: s.accent, stroke: s.accent },
              })
            : s.icon;
        const sc = subColor(s.sub);
        return (
          <div className="sc" key={i}>
            <div
              className="sc-icon"
              style={s.accent ? { background: `${s.accent}1f` } : undefined}
            >
              {iconEl}
            </div>
            <div className="sc-body">
              <div className="sc-lbl">{s.label}</div>
              <div className="sc-val" style={{ color: "var(--text)" }}>
                {s.value}
                {s.trend ? (
                  <span
                    className="sc-up"
                    style={s.trend.dir === "down" ? { color: "var(--danger)" } : undefined}
                  >
                    {s.trend.dir === "down" ? "↓" : "↑"} {s.trend.text}
                  </span>
                ) : null}
              </div>
              {s.sub ? (
                <div className="sc-mo" style={sc ? { color: sc } : undefined}>
                  {s.sub}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
