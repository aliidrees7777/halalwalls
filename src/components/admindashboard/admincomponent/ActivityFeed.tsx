"use client";
import { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  Users,
  CheckCircle,
  CreditCard,
  DollarSign,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";

interface Activity {
  type: string;
  title: string;
  subtitle: string;
  slug?: string;
  at: string;
}

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d > 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const activityStyle = (type: string) => {
  switch (type) {
    case "wallpaper_uploaded":
      return { color: "#05DF8B", bg: "rgba(5,223,139,.1)", Icon: ImageIcon };
    case "wallpaper_approved":
      return { color: "#05DF8B", bg: "rgba(5,223,139,.1)", Icon: CheckCircle };
    case "user":
      return { color: "#6366F1", bg: "rgba(99,102,241,.1)", Icon: Users };
    case "subscription":
      return { color: "#F59E0B", bg: "rgba(245,158,11,.1)", Icon: CreditCard };
    default:
      return { color: "#05DF8B", bg: "rgba(5,223,139,.1)", Icon: DollarSign };
  }
};

const RANGE_LIMITS = [15, 30, 50];

const ActivityFeed = ({ onBack }: { onBack?: () => void }) => {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    api
      .get<{ activity: Activity[]; pagination?: { totalPages: number; total: number } }>(
        `/admin/activity?page=${page}&limit=${limit}`
      )
      .then((d) => {
        if (ignore) return;
        setItems(d.activity || []);
        setTotalPages(d.pagination?.totalPages || 1);
        setTotal(d.pagination?.total || 0);
      })
      .catch((e) => {
        if (!ignore) setError(e instanceof ApiError ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [page, limit]);

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
          <ArrowLeft size={16} /> Recent Activity
        </button>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          style={{
            background: "var(--bg3)",
            border: "1px solid var(--border2)",
            color: "var(--text2)",
            fontSize: "0.77rem",
            padding: "7px 10px",
            borderRadius: "var(--rs)",
            cursor: "pointer",
            appearance: "auto",
          }}
        >
          {RANGE_LIMITS.map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((a, i) => {
          const { color, bg, Icon } = activityStyle(a.type);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "12px 2px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                className="act-ico"
                style={{ background: bg, flexShrink: 0 }}
              >
                <Icon size={16} style={{ stroke: color, color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>
                  {a.title}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--text2)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.subtitle}
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text3)", whiteSpace: "nowrap" }}>
                {timeAgo(a.at)}
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div style={{ padding: "22px 4px", color: "var(--text3)", fontSize: 13 }}>Loading…</div>
      )}
      {!loading && error && (
        <div style={{ padding: "22px 4px", color: "#f0a0a0", fontSize: 13 }}>{error}</div>
      )}
      {!loading && !error && items.length === 0 && (
        <div style={{ padding: "22px 4px", color: "var(--text3)", fontSize: 13 }}>
          No activity yet.
        </div>
      )}

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginTop: 14,
            fontSize: 13,
            color: "var(--text2)",
          }}
        >
          <span style={{ color: "var(--text3)", fontSize: 12 }}>{total} recent events</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="amore"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{ opacity: page <= 1 ? 0.4 : 1 }}
            >
              <ChevronLeft size={15} />
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="amore"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{ opacity: page >= totalPages ? 0.4 : 1 }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
