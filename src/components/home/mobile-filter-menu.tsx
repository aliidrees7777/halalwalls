"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { filterPills } from "@/data/filters";
import { useCategories, useResolutions } from "@/hooks/use-catalog";
import { buildFilterHref, normalizeResolution } from "@/lib/filter-url";
import { cn } from "@/lib/utils";

const browse = filterPills.filter((p) =>
  ["latest", "random", "popular"].includes(p.id),
);

/** Figma Halal-Stock-Mobile-App — Opening menu 2 @ 412px */
const sectionLabel =
  "text-[12px] font-bold uppercase tracking-[0.05em] text-[#999999] dark:tracking-[0.06em] dark:text-[#ccc]";

const explorePill =
  "inline-flex h-[35px] w-[74px] items-center justify-center rounded-full border-[0.8px] border-transparent bg-[#F0F0F0] p-[10px] text-[12px] font-medium tracking-[0.02em] text-[#666666] transition-colors dark:bg-[#303133] dark:tracking-[0.24px] dark:text-[#ccc]";

const selectedStroke =
  "border-[2px] border-[#05DF8B] bg-hw-green/20 font-bold text-hw-green dark:border-[#05DF8B] dark:bg-hw-green/20 dark:text-hw-green";

const filterPill =
  "inline-flex items-center justify-center rounded-full border-[0.8px] border-[#999999] bg-[#F0F0F0] p-[10px] text-[12px] font-medium tracking-[0.02em] text-[#666666] transition-colors dark:border-[#5b6268] dark:bg-[#303133] dark:tracking-[0.24px] dark:text-[#ccc]";

/** ~3 rows of category pills; last pill is "All N+". */
const CATEGORIES_PREVIEW_LIMIT = 11;

const appPill =
  "inline-flex h-[35px] items-center justify-center rounded-full bg-[#F0F0F0] text-[#666666] transition-colors dark:bg-[#303133] dark:text-[#ccc]";

const themeOptions = [
  { value: "system", label: "Auto", icon: "auto" },
  { value: "dark", label: "Dark", icon: "dark" },
  { value: "light", label: "Light", icon: "light" },
] as const;

function ThemeIcon({
  type,
  isDark,
}: {
  type: "auto" | "dark" | "light";
  isDark: boolean;
}) {
  const src =
    type === "dark"
      ? isDark
        ? "/Half-moon-icon-darkmode.svg"
        : "/Half-moon-icon-lightmode.svg"
      : type === "light"
        ? isDark
          ? "/Light-icon-darkmode.svg"
          : "/Light-icon-lightmode.svg"
        : isDark
          ? "/Auto-mode-icon-darkmode.svg"
          : "/Auto-mode-icon-lightmode.svg";

  return (
    <Image
      src={src}
      alt=""
      width={15}
      height={15}
      className="size-[15px]"
    />
  );
}

export function MobileFilterMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { categories } = useCategories();
  const res = useResolutions();
  const resolutions = [...res.desktop, ...res.mobile];
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const activeResolution = searchParams.get("resolution") || "";
  const activeSort = searchParams.get("sort") || "latest";
  const hasCategory = Boolean(activeCategory);
  const hasResolution = Boolean(activeResolution);
  const [mounted, setMounted] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, CATEGORIES_PREVIEW_LIMIT);
  const hasMoreCategories = categories.length > CATEGORIES_PREVIEW_LIMIT;

  return (
    <div className="flex flex-col gap-[26px]">
      <section className="flex flex-col gap-3">
        <p className={sectionLabel}>Explore</p>
        <div className="flex flex-wrap gap-[10px]">
          {browse.map((p) => {
            const isActive = !hasCategory && !hasResolution && activeSort === p.id;
            return (
              <Link
                key={p.id}
                href={buildFilterHref(searchParams, {
                  sort: p.id,
                  category: null,
                  resolution: null,
                })}
                onClick={onNavigate}
                className={cn(
                  explorePill,
                  isActive && selectedStroke,
                )}
              >
                {p.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className={sectionLabel}>Categories</p>
        <div className="flex flex-wrap gap-2">
          {visibleCategories.map((c) => {
            const isPremium = c.isPremium || c.slug === "premium";
            const isActive = !hasResolution && activeCategory === c.slug;
            return (
              <Link
                key={c.id}
                href={buildFilterHref(searchParams, {
                  category: c.slug,
                  sort: null,
                  resolution: null,
                })}
                onClick={onNavigate}
                className={cn(
                  filterPill,
                  isPremium &&
                    "border-[#B5943C] text-[#B5943C] dark:border-[#ffd700] dark:text-[#ffd700]",
                  isActive && selectedStroke,
                )}
              >
                {c.name}
              </Link>
            );
          })}
          {hasMoreCategories && (
            <button
              type="button"
              onClick={() => setShowAllCategories((open) => !open)}
              className={cn(
                filterPill,
                "border-[#647CDC] text-[#647CDC] dark:border-[#819ce4] dark:text-[#819ce4]",
              )}
            >
              {showAllCategories ? "Less" : `All ${categories.length}+`}
            </button>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className={sectionLabel}>Resolutions</p>
        <div className="flex flex-wrap gap-2">
          {resolutions.map((r) => {
            const key = normalizeResolution(r);
            const isActive = activeResolution === key;
            return (
              <Link
                key={r}
                href={buildFilterHref(searchParams, {
                  resolution: key,
                  category: null,
                  sort: null,
                })}
                onClick={onNavigate}
                className={cn(
                  filterPill,
                  isActive && selectedStroke,
                )}
              >
                {r}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className={sectionLabel}>Get the App</p>
        <div className="flex flex-wrap gap-x-2.5 gap-y-1.5">
          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(appPill, "gap-[4.412px] px-[11.029px] text-[13.235px] tracking-[0.02em]")}
          >
            <svg
              width="18"
              height="10"
              viewBox="0 0 18 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M13.1461 3.00308L14.6147 0.459524C14.6406 0.415984 14.6559 0.36303 14.6559 0.306545C14.6559 0.137681 14.5194 0.00117695 14.3506 0.00117695C14.2382 0.00117695 14.1399 0.0617799 14.087 0.15239L14.0864 0.153567L12.5995 2.7289C11.4893 2.21878 10.1907 1.92106 8.82274 1.92106C7.45476 1.92106 6.1562 2.21878 4.98827 2.75244L5.04593 2.7289L3.5591 0.152979C3.50556 0.0611915 3.40671 0 3.29433 0C3.12547 0 2.98896 0.136504 2.98896 0.305369C2.98896 0.361853 3.00426 0.414219 3.03074 0.459524L3.03015 0.458347L4.49874 3.00191C1.97695 4.3946 0.241235 6.94228 0.00176515 9.91183L0 9.94242H17.6461C17.4048 6.94228 15.6691 4.3946 13.192 3.02427L13.1473 3.00191L13.1461 3.00308ZM4.76057 7.42946C4.35459 7.42946 4.02569 7.10055 4.02569 6.69457C4.02569 6.28859 4.35459 5.95969 4.76057 5.95969C5.16655 5.95969 5.49546 6.28859 5.49546 6.69457C5.49487 7.09996 5.16655 7.42887 4.76057 7.42946ZM12.8825 7.42946C12.4766 7.42946 12.1477 7.10055 12.1477 6.69457C12.1477 6.28859 12.4766 5.95969 12.8825 5.95969C13.2885 5.95969 13.6174 6.28859 13.6174 6.69457C13.6168 7.09996 13.2885 7.42887 12.8825 7.42946Z"
                fill="#95CF00"
              />
            </svg>
            Android
          </a>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className={sectionLabel}>Theme</p>
        <div className="flex flex-wrap gap-x-2.5 gap-y-1.5">
          {themeOptions.map(({ value, label, icon }) => {
            const active = mounted && theme === value;
            const padding =
              icon === "auto"
                ? "px-[11.029px] py-[11.029px] text-[13.235px] tracking-[0.02em]"
                : icon === "dark"
                  ? "px-[10.595px] py-[10.595px] text-[12.714px] tracking-[0.02em]"
                  : "px-[10.588px] py-[10.588px] text-[12.706px] tracking-[0.02em]";
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center justify-center gap-1 rounded-full text-[#555555] transition-colors dark:text-[#ccc]",
                  padding,
                  active
                    ? "border-[1.6px] border-[#555555] bg-[#E0E0E0] dark:border-[#ccc] dark:bg-[#3f4042]"
                    : "bg-[#F0F0F0] dark:bg-[#303133]",
                )}
              >
                <ThemeIcon type={icon} isDark={isDark} />
                {label}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
