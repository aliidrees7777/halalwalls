"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, CreditCard, Calendar, Crown, DollarSign } from "lucide-react";
import { api } from "@/lib/api";
import { AdminListPage } from "../reusable/AdminListPage";
import type { ListPageConfig, StatCardDef } from "../reusable/types";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  plan: string;
  status: string;
  revenue: number;
  currentPeriodEnd: string | null;
  createdAt: string;
}

interface SubStats {
  total: number;
  monthly: number;
  yearly: number;
  lifetime: number;
  revenue: number;
}

const fmt = (n: number) => n.toLocaleString("en-US");
const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const PLAN_STYLE: Record<string, { label: string; color: string }> = {
  monthly: { label: "Monthly", color: "#05df8b" },
  yearly: { label: "Yearly", color: "#14b8a6" },
  lifetime: { label: "Lifetime", color: "#f59e0b" },
};

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 5, background: `${color}1a`,
        color, padding: "3px 9px", borderRadius: 50, fontSize: "0.68rem", fontWeight: 700,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color }} />
      {text}
    </span>
  );
}

const SubscribersPage = () => {
  const [stats, setStats] = useState<SubStats | null>(null);

  useEffect(() => {
    let ignore = false;
    api.get<SubStats>("/admin/subscribers/stats").then((d) => {
      if (!ignore) setStats(d);
    }).catch(() => {});
    return () => { ignore = true; };
  }, []);

  const fetcher = useCallback(
    async ({ search, filters, sort, page, pageSize }: {
      search: string; filters: Record<string, string>; sort: string; page: number; pageSize: number;
    }) => {
      const p = new URLSearchParams({ page: String(page), limit: String(pageSize) });
      if (search) p.set("q", search);
      if (sort) p.set("sort", sort);
      if (filters.plan) p.set("plan", filters.plan);
      const d = await api.get<{ subscribers: Subscriber[]; pagination: { total: number } }>(
        `/admin/subscribers?${p.toString()}`
      );
      return { rows: d.subscribers as unknown as Record<string, unknown>[], total: d.pagination.total };
    },
    []
  );

  const cards: StatCardDef[] = useMemo(() => {
    const s = stats;
    return [
      { label: "Total Subscribers", value: s ? fmt(s.total) : "—", sub: "premium members", icon: <Users size={18} /> },
      { label: "Monthly", value: s ? fmt(s.monthly) : "—", sub: "$2.99 / mo", icon: <CreditCard size={18} />, accent: "#05df8b" },
      { label: "Yearly", value: s ? fmt(s.yearly) : "—", sub: "$9.99 / yr", icon: <Calendar size={18} />, accent: "#14b8a6" },
      { label: "Lifetime", value: s ? fmt(s.lifetime) : "—", sub: "$29.99 once", icon: <Crown size={18} />, accent: "#f59e0b" },
      { label: "Est. Revenue", value: s ? `$${fmt(s.revenue)}` : "—", sub: "from active plans", icon: <DollarSign size={18} /> },
    ];
  }, [stats]);

  const config: ListPageConfig = useMemo(() => ({
    title: "Subscribers",
    breadcrumb: ["Dashboard", "Subscribers"],
    stats: cards,
    searchPlaceholder: "Search subscribers by name or email…",
    fetcher,
    rowId: (r) => String((r as unknown as Subscriber).id),
    filters: [
      {
        key: "plan", placeholder: "All Plans",
        options: [
          { label: "Monthly", value: "monthly" },
          { label: "Yearly", value: "yearly" },
          { label: "Lifetime", value: "lifetime" },
        ],
      },
    ],
    sortOptions: [
      { label: "Newest", value: "latest" },
      { label: "Oldest", value: "oldest" },
      { label: "Name A–Z", value: "name" },
    ],
    columns: [
      {
        key: "subscriber", header: "Subscriber",
        cell: (r) => {
          const s = r as unknown as Subscriber;
          return (
            <div className="flex items-center gap-3">
              <div
                className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold"
                style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
              >
                {(s.name || s.email || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="wtitle">{s.name || "—"}</div>
                <div className="uemail">{s.email}</div>
              </div>
            </div>
          );
        },
      },
      {
        key: "plan", header: "Plan",
        cell: (r) => {
          const p = PLAN_STYLE[(r as unknown as Subscriber).plan] ?? { label: (r as unknown as Subscriber).plan, color: "#8e9ba0" };
          return <Badge text={p.label} color={p.color} />;
        },
      },
      {
        key: "status", header: "Status",
        cell: (r) => {
          const s = (r as unknown as Subscriber).status;
          const ok = s === "active" || s === "trialing";
          return <Badge text={s} color={ok ? "#05df8b" : "#8e9ba0"} />;
        },
      },
      { key: "revenue", header: "Revenue", cell: (r) => <span className="restext">${(r as unknown as Subscriber).revenue.toFixed(2)}</span> },
      { key: "renews", header: "Renews", cell: (r) => <span className="ddate">{fmtDate((r as unknown as Subscriber).currentPeriodEnd)}</span> },
      { key: "joined", header: "Joined", cell: (r) => <span className="ddate">{fmtDate((r as unknown as Subscriber).createdAt)}</span> },
    ],
  }), [cards, fetcher]);

  return <AdminListPage config={config} />;
};

export default SubscribersPage;
