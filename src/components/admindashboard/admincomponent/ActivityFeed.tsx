"use client";
import { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  Users,
  CheckCircle,
  CreditCard,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { LoadingBlock } from "@/components/shared/loading-spinner";
import { Pagination, SEE_ALL_PAGE_SIZE } from "../reusable/Pagination";

interface Activity {
  type: string;
  title: string;
  subtitle: string;
  slug?: string;
  at: string | null;
}

/** Absolute local date/time — same style as other admin tables. */
const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const fmtTime = (iso: string | null | undefined) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
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

const PAGE_SIZE_OPTIONS = [15, 30, 50, SEE_ALL_PAGE_SIZE];

const ActivityFeed = ({ onBack }: { onBack?: () => void }) => {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [total, setTotal] = useState(0);

  const seeAll = pageSize === SEE_ALL_PAGE_SIZE;
  const fetchLimit = seeAll ? "all" : pageSize;

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    const qs = new URLSearchParams({
      page: String(seeAll ? 1 : page),
      limit: String(fetchLimit),
    });
    api
      .get<{ activity: Activity[]; pagination?: { total: number } }>(
        `/admin/activity?${qs}`,
      )
      .then((d) => {
        if (ignore) return;
        setItems(d.activity || []);
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
  }, [page, pageSize, seeAll, fetchLimit]);

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
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((a, i) => {
          const { color, bg, Icon } = activityStyle(a.type);
          return (
            <div
              key={`${a.type}-${a.at}-${i}`}
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
              <div style={{ textAlign: "right", whiteSpace: "nowrap", flexShrink: 0 }}>
                <div className="ddate">{fmtDate(a.at)}</div>
                <div className="dtime">{fmtTime(a.at)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <LoadingBlock className="py-[22px]" />}
      {!loading && error && (
        <div style={{ padding: "22px 4px", color: "#f0a0a0", fontSize: 13 }}>{error}</div>
      )}
      {!loading && !error && items.length === 0 && (
        <div style={{ padding: "22px 4px", color: "var(--text3)", fontSize: 13 }}>
          No activity yet.
        </div>
      )}

      {!loading && !error && total > 0 && (
        <Pagination
          page={seeAll ? 1 : page}
          pageSize={pageSize}
          total={total}
          onPage={setPage}
          onPageSize={(n) => {
            setPageSize(n);
            setPage(1);
          }}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          noun="events"
        />
      )}
    </div>
  );
};

export default ActivityFeed;
