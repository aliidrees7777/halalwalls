"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useCategories } from "@/hooks/use-catalog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import play from "../../../public/play.svg";
import shuffle from "../../../public/shuffle.svg";
import flame from "../../../public/flame.svg";
import lightrocket from "../../../public/cate-icon/lightrocket.svg";
import playDark from "../../../public/cate-icon/playdark.svg";
import randomDark from "../../../public/cate-icon/randomdark.svg";
import popularDark from "../../../public/cate-icon/populardark.svg";
import latestDark from "../../../public/cate-icon/latestdark.svg";

/**
 * Homepage filter row below the search box:
 * - Browse modes set ?sort= (Latest / Live / Random / Popular)
 * - Category pills set ?category= like the sidebar
 * Only one pill in this row is highlighted at a time (category wins over sort).
 * Mouse wheel scrolls this strip horizontally (no Shift required).
 */

const pillClass = (active: boolean, premium = false) =>
  cn(
    "flex h-[var(--lp-pill-h)] shrink-0 items-center gap-[var(--lp-pill-icon-gap)] rounded-[var(--lp-pill-radius)] px-[var(--lp-pill-px)] text-[length:var(--lp-pill-font)] leading-none",
    active
      ? "bg-hw-green font-semibold text-white dark:text-black"
      : cn(
          "bg-hw-pill font-medium hover:bg-hw-pill2-hover",
          premium ? "text-hw-yellow" : "text-black dark:text-white",
        ),
  );

const SORT_MODES = [
  { id: "latest", label: "Latest", icon: lightrocket, iconDarkSelected: latestDark },
  { id: "live", label: "Live Walls", icon: play, iconDarkSelected: playDark },
  { id: "random", label: "Random", icon: shuffle, iconDarkSelected: randomDark },
  { id: "popular", label: "Popular", icon: flame, iconDarkSelected: popularDark },
] as const;

export function FilterPills() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories } = useCategories();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const activeSort = searchParams.get("sort") || "latest";
  const activeCategory = searchParams.get("category") || "";

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

  // Vertical mouse wheel → horizontal scroll for this row.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;

      const dominantY = Math.abs(event.deltaY) >= Math.abs(event.deltaX);
      if (!dominantY || event.deltaY === 0) return;

      event.preventDefault();
      el.scrollLeft += event.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={scrollerRef}
      className="pills-scroll"
      role="tablist"
      aria-label="Wallpaper filters"
    >
      {SORT_MODES.map((mode) => {
        // Category selection owns the highlight when both params are present.
        const isActive = !activeCategory && activeSort === mode.id;
        // Dark+selected uses black SVG assets — CSS filters on next/image were unreliable.
        const iconSrc =
          isActive && isDark ? mode.iconDarkSelected : mode.icon;

        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => go({ sort: mode.id, category: null })}
            className={pillClass(isActive)}
          >
            {mode.label}
            <Image
              src={iconSrc}
              alt=""
              width={22}
              height={22}
              className={cn(
                "h-[var(--lp-pill-icon)] w-[var(--lp-pill-icon)]",
                // Idle light: blacken white SVG. Idle dark / active light: keep white SVG.
                !isActive && !isDark && "brightness-0",
              )}
            />
          </button>
        );
      })}

      {categories.map((category) => {
        const isActive = activeCategory === category.slug;
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() =>
              go({ category: isActive ? null : category.slug })
            }
            className={pillClass(isActive, category.isPremium)}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
