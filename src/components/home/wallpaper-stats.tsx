"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Stats {
  totalWallpapers: number;
  totalDownloads: number;
  totalCategories: number;
  totalViews: number;
}

const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`;

/** Live platform counters from GET /stats. Renders nothing until loaded. */
export function WallpaperStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let ignore = false;
    api
      .get<Stats>("/stats")
      .then((d) => !ignore && setStats(d))
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  if (!stats) return null;

  const items = [
    { label: "Wallpapers", value: stats.totalWallpapers },
    { label: "Downloads", value: stats.totalDownloads },
    { label: "Categories", value: stats.totalCategories },
  ];

  return (
    <section className="border-t border-hw-border bg-hw-surface/40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-3 gap-6 px-4 py-8 text-center lg:px-6">
        {items.map((i) => (
          <div key={i.label}>
            <p className="text-2xl font-bold tracking-tight text-hw-foreground sm:text-3xl">
              {fmt(i.value)}
            </p>
            <p className="mt-1 text-xs text-hw-muted sm:text-sm">{i.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
