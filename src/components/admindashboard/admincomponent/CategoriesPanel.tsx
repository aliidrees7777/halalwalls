"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { api, ApiError } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  isPremium: boolean;
  order: number;
  count: number; // live count of active wallpapers in this category
}

type SortKey = "count_desc" | "count_asc" | "name_asc" | "name_desc";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "count_desc", label: "Most wallpapers" },
  { key: "count_asc", label: "Fewest wallpapers" },
  { key: "name_asc", label: "Name A–Z" },
  { key: "name_desc", label: "Name Z–A" },
];

const border = "1px solid rgba(255,255,255,0.08)";
const selectStyle: React.CSSProperties = {
  background: "var(--bg3)",
  border: "1px solid var(--border2)",
  color: "var(--text2)",
  fontSize: "0.77rem",
  padding: "7px 10px",
  borderRadius: "var(--rs)",
  cursor: "pointer",
  appearance: "auto",
};

interface Props {
  variant?: "widget" | "full";
  onViewAll?: () => void;
  onBack?: () => void;
}

const CategoriesPanel = ({ variant = "widget", onViewAll, onBack }: Props) => {
  const isFull = variant === "full";
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // full-view controls
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("count_desc");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api
      .get<{ categories: Category[] }>("/categories")
      .then((d) => {
        if (!ignore) setCats(d.categories || []);
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load"))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const maxCount = useMemo(
    () => cats.reduce((m, c) => Math.max(m, c.count), 0) || 1,
    [cats]
  );

  // Ranked (by count desc) — the canonical "top categories" order.
  const ranked = useMemo(
    () => [...cats].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    [cats]
  );

  // ── widget: top 6 ──
  if (!isFull) {
    const top = ranked.slice(0, 6);
    return (
      <div className="rcard">
        <div className="rcard-ttl">
          Top Categories{" "}
          <a style={{ cursor: "pointer" }} onClick={onViewAll}>
            View All
          </a>
        </div>
        {loading && (
          <div style={{ color: "var(--text3)", fontSize: 13, padding: "6px 0" }}>Loading…</div>
        )}
        {!loading && top.length === 0 && (
          <div style={{ color: "var(--text3)", fontSize: 13, padding: "6px 0" }}>
            No categories yet.
          </div>
        )}
        {top.map((c) => (
          <div className="cat-prog" key={c.id}>
            <div className="cp-hdr">
              <span className="cp-name">{c.name}</span>
              <span className="cp-val">{c.count.toLocaleString()}</span>
            </div>
            <div className="pbg">
              <div className="pfill" style={{ width: `${(c.count / maxCount) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── full view: search + sort + limit + pagination ──
  const filtered = ranked.filter((c) => c.name.toLowerCase().includes(q.trim().toLowerCase()));
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "count_asc":
        return a.count - b.count;
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      default:
        return b.count - a.count;
    }
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * limit, safePage * limit);

  return (
    <div className="ucard">
      <div className="ucard-top">
        <button
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: "none",
            border: "none",
            color: "var(--text)",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={16} /> Top Categories
        </button>
        <span style={{ fontSize: "0.75rem", color: "var(--text3)" }}>
          {sorted.length} categories
        </span>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div style={{ position: "relative", flex: "1 1 240px", minWidth: 200 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text3)",
            }}
          />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search categories…"
            style={{
              width: "100%",
              background: "var(--bg3)",
              border: "1px solid var(--border2)",
              borderRadius: "var(--rs)",
              color: "var(--text)",
              fontSize: "0.8rem",
              padding: "8px 12px 8px 34px",
              outline: "none",
            }}
          />
        </div>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as SortKey);
            setPage(1);
          }}
          style={selectStyle}
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          style={selectStyle}
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>

      <div className="tw">
        <table>
          <thead>
            <tr>
              <th style={{ width: 50 }}>#</th>
              <th>Category</th>
              <th>Wallpapers</th>
              <th style={{ width: "38%" }}>Share</th>
              <th>Tier</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((c, i) => (
              <tr key={c.id}>
                <td style={{ color: "var(--text3)", fontWeight: 700 }}>
                  {(safePage - 1) * limit + i + 1}
                </td>
                <td>
                  <div className="wtitle">{c.name}</div>
                  <div className="wtags">/{c.slug}</div>
                </td>
                <td>
                  <span className="restext">{c.count.toLocaleString()}</span>
                </td>
                <td>
                  <div className="pbg" style={{ maxWidth: 260 }}>
                    <div className="pfill" style={{ width: `${(c.count / maxCount) * 100}%` }} />
                  </div>
                </td>
                <td>
                  {c.isPremium ? (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#F59E0B",
                        background: "rgba(245,158,11,0.12)",
                        padding: "3px 9px",
                        borderRadius: 50,
                      }}
                    >
                      Premium
                    </span>
                  ) : (
                    <span className="catb cat-n">Free</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div style={{ padding: "22px 4px", color: "var(--text3)", fontSize: 13 }}>Loading…</div>
        )}
        {!loading && error && (
          <div style={{ padding: "22px 4px", color: "#f0a0a0", fontSize: 13 }}>{error}</div>
        )}
        {!loading && !error && pageRows.length === 0 && (
          <div style={{ padding: "22px 4px", color: "var(--text3)", fontSize: 13 }}>
            No categories match “{q}”.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 14,
            fontSize: 13,
            color: "var(--text2)",
          }}
        >
          <button
            className="amore"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{ opacity: safePage <= 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={15} />
          </button>
          <span>
            Page {safePage} of {totalPages}
          </span>
          <button
            className="amore"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={{ opacity: safePage >= totalPages ? 0.4 : 1 }}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoriesPanel;
