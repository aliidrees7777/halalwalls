"use client";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  Image as ImageIcon,
  Users,
  DollarSign,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { useAdminAnalytics } from "@/hooks/use-admin-analytics";

const PLAN_COLORS: Record<string, string> = {
  monthly: "#05DF8B",
  yearly: "#02A86A",
  lifetime: "#1F4D37",
};

const fmt = (n: number) => n.toLocaleString("en-US");

const fmtDay = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
};

// Icon + accent colour per recent-activity type.
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

const RANGE_OPTIONS = [
  { key: "7d", label: "Last 7 days" },
  { key: "14d", label: "Last 14 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "month", label: "This month" },
];

const ChartsRow = ({
  onViewActivity,
  onViewSubscribers,
}: {
  onViewActivity?: () => void;
  onViewSubscribers?: () => void;
}) => {
  const [range, setRange] = useState("14d");
  const { data } = useAdminAnalytics(range);
  const dlChartRef = useRef<HTMLCanvasElement>(null);
  const donutChartRef = useRef<HTMLCanvasElement>(null);

  const series = data?.trend.series ?? [];
  const breakdown = data?.subscriptions.breakdown ?? [];
  const totalSubs = data?.subscriptions.total ?? 0;
  const activity = data?.recentActivity ?? [];

  useEffect(() => {
    let dlChart: Chart | null = null;
    let donutChart: Chart | null = null;

    // ── Trend line chart (wallpapers uploaded per day) ──
    if (dlChartRef.current && series.length) {
      const dlCtx = dlChartRef.current.getContext("2d");
      if (dlCtx) {
        const grad = dlCtx.createLinearGradient(0, 0, 0, 190);
        grad.addColorStop(0, "rgba(5,223,139,0.22)");
        grad.addColorStop(1, "rgba(5,223,139,0.0)");

        dlChart = new Chart(dlCtx, {
          type: "line",
          data: {
            labels: series.map((p) => fmtDay(p.date)),
            datasets: [
              {
                label: data?.trend.label ?? "Uploads",
                data: series.map((p) => p.value),
                borderColor: "#05DF8B",
                borderWidth: 2,
                backgroundColor: grad,
                fill: true,
                tension: 0.42,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#05DF8B",
                pointHoverBorderColor: "#fff",
                pointHoverBorderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#242A2B",
                borderColor: "#3A4245",
                borderWidth: 1,
                titleColor: "#8E9BA0",
                bodyColor: "#F0F4F5",
                titleFont: { size: 10 },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                  label: (c) =>
                    `${data?.trend.label ?? "Uploads"}: ${c.formattedValue}`,
                },
              },
            },
            scales: {
              x: {
                grid: { color: "rgba(255,255,255,0.04)" },
                border: { color: "transparent" },
                ticks: {
                  color: "#576468",
                  font: { size: 10 },
                  maxTicksLimit: 7,
                },
              },
              y: {
                grid: { color: "rgba(255,255,255,0.04)" },
                border: { color: "transparent" },
                ticks: {
                  color: "#576468",
                  font: { size: 10 },
                  precision: 0,
                  maxTicksLimit: 6,
                },
                min: 0,
                // Keep peaks off the top edge so a day with e.g. 20 downloads
                // doesn't look like the axis is hard-capped at 20.
                grace: "15%",
                beginAtZero: true,
              },
            },
          },
        });
      }
    }

    // ── Subscription-plan donut ──
    if (donutChartRef.current && breakdown.length) {
      donutChart = new Chart(donutChartRef.current, {
        type: "doughnut",
        data: {
          labels: breakdown.map((b) => b.plan),
          datasets: [
            {
              data: breakdown.map((b) => b.count),
              backgroundColor: breakdown.map(
                (b) => PLAN_COLORS[b.plan] ?? "#576468"
              ),
              borderWidth: 0,
              hoverOffset: 5,
            },
          ],
        },
        options: {
          responsive: false,
          cutout: "73%",
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#242A2B",
              borderColor: "#3A4245",
              borderWidth: 1,
              titleColor: "#8E9BA0",
              bodyColor: "#F0F4F5",
              cornerRadius: 8,
              callbacks: {
                label: (c) =>
                  `${c.label.charAt(0).toUpperCase() + c.label.slice(1)}: ${c.formattedValue}`,
              },
            },
          },
        },
      });
    }

    return () => {
      dlChart?.destroy();
      donutChart?.destroy();
    };
  }, [series, breakdown, data]);

  return (
    <div>
      <div className="charts-row">
        <div className="card">
          <div className="card-hdr">
            <span className="card-ttl">Downloads Overview</span>
            <select
              className="card-btn"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              style={{ cursor: "pointer", appearance: "auto" }}
            >
              {(data?.trend.options ?? RANGE_OPTIONS).map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="dl-wrap">
            <canvas ref={dlChartRef} id="dlChart"></canvas>
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">
            <span className="card-ttl">Subscription Plans</span>
            <a className="vlink" style={{ cursor: "pointer" }} onClick={onViewSubscribers}>
              View all
            </a>
          </div>
          <div className="donut-outer">
            <div className="donut-pos">
              <canvas
                ref={donutChartRef}
                id="donutChart"
                width="148"
                height="148"
              ></canvas>
              <div className="donut-center">
                <div className="donut-num">{fmt(totalSubs)}</div>
                <div className="donut-lbl">Total</div>
              </div>
            </div>
            {breakdown.map((b) => (
              <div className="leg-row" key={b.plan}>
                <div className="leg-l">
                  <div
                    className="leg-dot"
                    style={{ background: PLAN_COLORS[b.plan] ?? "#576468" }}
                  ></div>
                  <span style={{ textTransform: "capitalize" }}>{b.plan}</span>
                </div>
                <div className="leg-r">
                  {fmt(b.count)} &nbsp;
                  <span style={{ color: "var(--text3)" }}>{b.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">
            <span className="card-ttl">Recent Activity</span>
          </div>
          <div className="act-list">
            {activity.length === 0 ? (
              <div
                className="act-desc"
                style={{ padding: "8px 2px", color: "var(--text3)" }}
              >
                No recent activity.
              </div>
            ) : (
              activity.map((a, i) => {
                const { color, bg, Icon } = activityStyle(a.type);
                return (
                  <div className="act-row" key={i}>
                    <div className="act-ico" style={{ background: bg }}>
                      <Icon size={15} style={{ stroke: color, color }} />
                    </div>
                    <div className="act-b">
                      <div className="act-title">{a.title}</div>
                      <div className="act-desc">{a.subtitle}</div>
                      <div className="act-time">{timeAgo(a.at)}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <button className="see-all" onClick={onViewActivity}>
            View all activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartsRow;
