"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Play, Shuffle } from "lucide-react";
import { useTags } from "@/hooks/use-catalog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import rocket from "../../../public/rocket.svg";
import play from "../../../public/play.svg";
import shuffle from "../../../public/shuffle.svg";
import flame from "../../../public/flame.svg";
import lightrocket from "../../../public/cate-icon/lightrocket.svg";
import playdark from "../../../public/cate-icon/playdark.svg";
import populardark from "../../../public/cate-icon/populardark.svg";
import randomdark from "../../../public/cate-icon/randomdark.svg";
import { useAuth } from "@/context/auth-context";

/**
 * Homepage filter row: the 4 browse modes (Latest / Live / Random / Popular)
 * followed by TAG pills (tags users assign to wallpapers at upload).
 *
 * Filters COMBINE via the URL: a browse mode sets ?sort, a tag sets ?tag, and
 * the current category (?category, chosen from the sidebar/header) is preserved
 * — so "Cars" + "Latest" → latest cars; "+ #neon" → latest neon cars.
 */

const pillClass = (active: boolean) =>
  cn(
    "flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-[11px] lg:text-[19px] text-[15px]  lg:font-medium font-semibold text-white ",
    active
      ? "bg-hw-green font-semibold  lg:text-[19px] text-[15px]"
      : "bg-hw-pill text-hw-depw hover:bg-hw-pill2-hover",
  );

export function FilterPills() {
  const { isLight } = useAuth();
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

  const BROWSE_MODES = [
    {
      id: "latest",
      label: "Latest",
      icon: lightrocket,
      darkIcon: rocket,
    },
    { id: "live", label: "Live Walls", icon: play, darkIcon: playdark },
    { id: "random", label: "Random", icon: shuffle, darkIcon: randomdark },
    { id: "popular", label: "Popular", icon: flame, darkIcon: populardark },
    { id: "anime", label: "Anime" },
    { id: "superheroes", label: "Superheroes" },
    { id: "minimalist", label: "Minimalist" },
    { id: "gaming", label: "Gaming" },
    { id: "movies", label: "Movies" },
    { id: "cars", label: "Cars" },
    { id: "sport", label: "Sport" },
    { id: "space", label: "Space" },
    { id: "animals", label: "Animals" },
    { id: "tvshows", label: "TV Shows" },
    { id: "3D", label: "3D" },
  ] as const;

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden "
      role="tablist"
      aria-label="Wallpaper filters"
    >
      {BROWSE_MODES.map((mode) => {
        // const Icon = mode.icon;
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
            {mode.label}
            {/* <Icon className="size-3.5" /> */}
            {"icon" in mode && (
              <Image
                src={isActive ? mode.icon : isLight ? mode.darkIcon : mode.icon}
                alt={mode.label}
                width={22}
                height={22}
                className="lg:w-[22px] lg:h-[22px] w-[17px] h-[17px]"
              />
            )}
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
