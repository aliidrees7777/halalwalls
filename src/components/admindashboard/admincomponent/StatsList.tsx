"use client";
import {
  Image as ImageIcon,
  Users,
  Star,
  Download,
  DollarSign,
} from "lucide-react";
import { useAdminAnalytics } from "@/hooks/use-admin-analytics";

const fmt = (n: number) => n.toLocaleString("en-US");

const StatsList = () => {
  const { data, loading } = useAdminAnalytics();
  const c = data?.cards;
  const m = data?.thisMonth;
  const dash = "—";
  const premiumPct =
    c && c.totalUsers ? Math.round((c.premiumUsers / c.totalUsers) * 1000) / 10 : 0;

  const cards = [
    {
      label: "Total Wallpapers",
      value: c ? fmt(c.totalWallpapers) : dash,
      sub: m ? `+${fmt(m.wallpapers)} this month` : "",
      subGreen: true,
      icon: <ImageIcon size={18} />,
    },
    {
      label: "Total Users",
      value: c ? fmt(c.totalUsers) : dash,
      sub: m ? `+${fmt(m.users)} this month` : "",
      subGreen: true,
      icon: <Users size={18} />,
    },
    {
      label: "Premium Users",
      value: c ? fmt(c.premiumUsers) : dash,
      sub: c ? `${premiumPct}% of users` : "",
      gold: true,
      icon: <Star size={18} style={{ stroke: "#F59E0B", color: "#F59E0B" }} />,
    },
    {
      label: "Total Downloads",
      value: c ? fmt(c.totalDownloads) : dash,
      sub: "across all wallpapers",
      icon: <Download size={18} />,
    },
    {
      label: "Total Revenue",
      value: c ? `$${fmt(c.totalRevenue)}` : dash,
      sub: data ? `${fmt(data.subscriptions.total)} subscriptions` : "",
      icon: <DollarSign size={18} />,
    },
  ];

  return (
    <div className="stats" style={loading ? { opacity: 0.7 } : undefined}>
      {cards.map((s, i) => (
        <div className="sc" key={i}>
          <div
            className="sc-icon"
            style={s.gold ? { background: "rgba(245,158,11,0.12)" } : undefined}
          >
            {s.icon}
          </div>
          <div className="sc-body">
            <div className="sc-lbl">{s.label}</div>
            <div className="sc-val" style={{ color: "var(--text)" }}>
              {s.value}
            </div>
            {s.sub ? (
              <div
                className="sc-mo"
                style={s.subGreen ? { color: "var(--brand)" } : undefined}
              >
                {s.sub}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsList;
