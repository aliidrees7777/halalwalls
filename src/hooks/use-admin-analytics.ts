"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface AnalyticsData {
  cards: {
    totalWallpapers: number;
    totalUsers: number;
    premiumUsers: number;
    totalDownloads: number;
    totalRevenue: number;
  };
  thisMonth: { wallpapers: number; users: number };
  subscriptions: {
    total: number;
    revenue: number;
    breakdown: { plan: string; count: number; percent: number }[];
  };
  trend: {
    label: string;
    range: string;
    rangeLabel: string;
    total: number;
    options: { key: string; label: string }[];
    series: { date: string; value: number }[];
  };
  topCategories: { name: string; count: number }[];
  recentActivity: { type: string; title: string; subtitle: string; at: string }[];
}

/**
 * Fetches the admin dashboard analytics (GET /admin/analytics, admin token).
 * Pass a `range` (7d | 14d | 30d | month) to drive the downloads-trend window;
 * changing it refetches.
 */
export function useAdminAnalytics(range?: string) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  // Bump to force a refetch (manual reload, or on returning to the tab).
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  // Refresh when the admin tab regains focus — so a download made on the user
  // side shows up here without a hard reload.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") refetch();
    };
    window.addEventListener("focus", refetch);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", refetch);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refetch]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    const qs = range ? `?range=${encodeURIComponent(range)}` : "";
    api
      .get<AnalyticsData>(`/admin/analytics${qs}`)
      .then((d) => {
        if (!ignore) setData(d);
      })
      .catch(() => {
        /* not admin / offline — leave data null, UI falls back gracefully */
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [range, tick]);

  return { data, loading, refetch };
}
