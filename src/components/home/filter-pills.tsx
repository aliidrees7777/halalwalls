"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/hooks/use-catalog";
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

/**
 * Homepage filter row below the search box:
 * - Browse modes set ?sort= (Latest / Live / Random / Popular)
 * - Category pills set ?category= like the sidebar
 * Mouse wheel scrolls this strip horizontally (no Shift required).
 */

const pillClass = (active: boolean) =>
  cn(
    "flex h-[var(--lp-pill-h)] shrink-0 items-center gap-[var(--lp-pill-icon-gap)] rounded-[var(--lp-pill-radius)] px-[var(--lp-pill-px)] text-[length:var(--lp-pill-font)] leading-none",
    active
      ? "bg-hw-green font-semibold text-black"
      : "bg-hw-pill font-medium text-white hover:bg-hw-pill2-hover",
  );

const SORT_MODES = [
  {
    id: "latest",
    label: "Latest",
    icon: lightrocket,
    darkIcon: rocket,
  },
  { id: "live", label: "Live Walls", icon: play, darkIcon: playdark },
  { id: "random", label: "Random", icon: shuffle, darkIcon: randomdark },
  { id: "popular", label: "Popular", icon: flame, darkIcon: populardark },
] as const;

export function FilterPills() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories } = useCategories();
  const scrollerRef = useRef<HTMLDivElement>(null);

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
            <Image
              src={mode.icon}
              alt=""
              width={22}
              height={22}
              className={cn(
                "w-[var(--lp-pill-icon)] h-[var(--lp-pill-icon)]",
                isActive ? "brightness-0" : "brightness-0 invert",
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
            className={pillClass(isActive)}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
