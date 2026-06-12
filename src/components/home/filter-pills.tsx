"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Play, Rocket, Shuffle } from "lucide-react";
import { useTags } from "@/hooks/use-catalog";
import { cn } from "@/lib/utils";

/**
 * Homepage filter row: the 4 browse modes (Latest / Live / Random / Popular)
 * followed by TAG pills (tags users assign to wallpapers at upload).
 *
 * Filters COMBINE via the URL: a browse mode sets ?sort, a tag sets ?tag, and
 * the current category (?category, chosen from the sidebar/header) is preserved
 * — so "Cars" + "Latest" → latest cars; "+ #neon" → latest neon cars.
 */
const BROWSE_MODES = [
  { id: "latest", label: "Latest", icon: Rocket },
  { id: "live", label: "Live Walls", icon: Play },
  { id: "random", label: "Random", icon: Shuffle },
  { id: "popular", label: "Popular", icon: Flame },
] as const;

const pillClass = (active: boolean) =>
  cn(
    "flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors",
    active ? "bg-hw-green text-black" : "bg-hw-pill text-hw-foreground hover:bg-hw-pill2-hover"
  );

export function FilterPills() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tags = useTags();

  const activeSort = searchParams.get("sort") || "latest";
  const activeTag = searchParams.get("tag") || "";

  // Merge an update into the current query (preserving the other filters).
  const go = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    params.delete("page"); // back to page 1 on any filter change
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  };

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Wallpaper filters"
    >
      {BROWSE_MODES.map((mode) => {
        const Icon = mode.icon;
        const isActive = activeSort === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => go({ sort: mode.id })}
            className={pillClass(isActive)}
          >
            <Icon className="size-3.5" />
            {mode.label}
          </button>
        );
      })}

      {tags.map((t) => {
        const isActive = activeTag === t.tag;
        return (
          <button
            key={t.tag}
            type="button"
            aria-pressed={isActive}
            onClick={() => go({ tag: isActive ? null : t.tag })}
            className={pillClass(isActive)}
          >
            #{t.tag}
          </button>
        );
      })}
    </div>
  );
}
