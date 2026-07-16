"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Contrast } from "lucide-react";
import { filterPills } from "@/data/filters";
import { useCategories, useResolutions } from "@/hooks/use-catalog";
import { buildFilterHref, normalizeResolution } from "@/lib/filter-url";
import { cn } from "@/lib/utils";

const browse = filterPills.filter((p) =>
  ["latest", "random", "popular"].includes(p.id),
);

/** Figma Halal-Stock-Mobile-App — Opening menu 2 @ 412px */
const MM = {
  premium: "#ffd700",
} as const;

const sectionLabel =
  "text-[12px] font-bold uppercase tracking-[0.06em] text-[#ccc]";

const explorePill =
  "inline-flex h-[35px] w-[74px] items-center justify-center rounded-full bg-[#303133] p-[10px] text-[12px] font-medium tracking-[0.24px] text-[#ccc] transition-colors";

const filterPill =
  "inline-flex items-center justify-center rounded-full border-[0.8px] border-[#5b6268] bg-[#303133] p-[10px] text-[12px] font-medium tracking-[0.24px] text-[#ccc] transition-colors";

const appPill =
  "inline-flex h-[35px] items-center justify-center rounded-full bg-[#303133] text-[#ccc] transition-colors";

const themeOptions = [
  { value: "system", label: "Auto", icon: "auto" },
  { value: "dark", label: "Dark", icon: "dark" },
  { value: "light", label: "Light", icon: "light" },
] as const;

function PremiumGem() {
  return (
    <svg
      width="12"
      height="9"
      viewBox="0 0 12 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M5.30357 0H2.00893L3.21429 1.8871L5.30357 0Z" fill={MM.premium} />
      <path
        d="M2.89375 1.95968L1.6875 0.0725806L0 1.95968H2.89375Z"
        fill={MM.premium}
      />
      <path
        d="M7.875 1.95968H3.69643L5.78571 0.0725806L7.875 1.95968Z"
        fill={MM.premium}
      />
      <path d="M9.5625 0H6.26786L8.27679 1.81452L9.5625 0Z" fill={MM.premium} />
      <path
        d="M9.88393 0.145161L8.59821 1.95968H11.5714L9.88393 0.145161Z"
        fill={MM.premium}
      />
      <path
        d="M3.05357 2.32258H0L5.22321 8.56452L3.05357 2.32258Z"
        fill={MM.premium}
      />
      <path
        d="M11.5714 2.32258H8.51786L6.34821 8.56452L11.5714 2.32258Z"
        fill={MM.premium}
      />
      <path
        d="M8.11607 2.32258H3.45536L5.78571 9L8.11607 2.32258Z"
        fill={MM.premium}
      />
    </svg>
  );
}

function ThemeIcon({ type }: { type: "auto" | "dark" | "light" }) {
  if (type === "dark") {
    return (
      <Image src="/mon.svg" alt="" width={15} height={15} className="size-[14.833px]" />
    );
  }
  if (type === "light") {
    return (
      <Image src="/sun.svg" alt="" width={15} height={15} className="size-[14.824px]" />
    );
  }
  return <Contrast className="size-[14px] text-[#ccc]" strokeWidth={2} />;
}

export function MobileFilterMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { theme, setTheme } = useTheme();
  const { categories } = useCategories();
  const res = useResolutions();
  const resolutions = [...res.desktop, ...res.mobile];
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const activeResolution = searchParams.get("resolution") || "";
  const activeSort = searchParams.get("sort") || "latest";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col gap-[26px]">
      <section className="flex flex-col gap-3">
        <p className={sectionLabel}>Explore</p>
        <div className="flex flex-wrap gap-[10px]">
          {browse.map((p) => {
            const isActive = activeSort === p.id;
            return (
              <Link
                key={p.id}
                href={buildFilterHref(searchParams, { sort: p.id })}
                onClick={onNavigate}
                className={cn(
                  explorePill,
                  isActive && "bg-hw-green/20 font-bold text-hw-green",
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
          {categories.map((c) => {
            const isPremium = c.isPremium || c.slug === "premium";
            const isActive = activeCategory === c.slug;
            return (
              <Link
                key={c.id}
                href={buildFilterHref(searchParams, { category: c.slug })}
                onClick={onNavigate}
                className={cn(
                  filterPill,
                  isPremium &&
                    "gap-[3px] border-[#ffd700] text-[#ffd700]",
                  isActive &&
                    !isPremium &&
                    "border-hw-green bg-hw-green/10 font-bold text-hw-green",
                  isActive &&
                    isPremium &&
                    "border-[#ffd700] bg-[#ffd700]/10 font-bold",
                )}
              >
                {c.name}
                {isPremium && <PremiumGem />}
              </Link>
            );
          })}
          <Link
            href="/"
            onClick={onNavigate}
            className={cn(
              filterPill,
              "border-[#819ce4] text-[#819ce4]",
            )}
          >
            All {categories.length}+
          </Link>
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
                })}
                onClick={onNavigate}
                className={cn(
                  filterPill,
                  isActive &&
                    "border-hw-green bg-hw-green/10 font-bold text-hw-green",
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
            className={cn(appPill, "gap-[4.412px] px-[11.029px] text-[13.235px] tracking-[0.2647px]")}
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
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              appPill,
              "w-[100px] gap-1 px-2.5 text-[12px] tracking-[0.24px]",
            )}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M9.86182 4.19024C9.86461 4.19024 9.86833 4.19024 9.87204 4.19024C9.96919 4.19024 10.0594 4.22045 10.1333 4.27251L10.1319 4.27158C10.1858 4.31853 10.222 4.38453 10.2309 4.4589V4.46029C10.2402 4.517 10.2453 4.58207 10.2453 4.64854C10.2453 4.67875 10.2444 4.7085 10.242 4.73825V4.73406C10.1375 5.83519 9.6838 8.50551 9.45325 9.73818C9.35564 10.2602 9.16368 10.4349 8.97776 10.4517C8.57384 10.4893 8.26707 10.1849 7.8757 9.92829C7.26308 9.52623 6.9168 9.27616 6.32231 8.88433C5.63486 8.43207 6.08061 8.18247 6.47198 7.77623C6.5747 7.66932 8.35538 6.04947 8.39024 5.90259C8.3921 5.89376 8.39303 5.884 8.39303 5.87377C8.39303 5.83752 8.37955 5.80451 8.3577 5.77942C8.33353 5.76361 8.30332 5.75478 8.27171 5.75478C8.2508 5.75478 8.23081 5.75896 8.21222 5.76594L8.21315 5.76547C8.15179 5.77942 7.17322 6.42612 5.27742 7.70558C5.07058 7.86873 4.80936 7.97191 4.5249 7.984H4.52211C4.11912 7.93519 3.75332 7.84548 3.40611 7.71766L3.44051 7.72882C3.00452 7.58659 2.65823 7.51175 2.68798 7.27098C2.70378 7.14579 2.87638 7.01766 3.20578 6.88659C5.23482 6.00252 6.58787 5.41981 7.26494 5.13845C8.01189 4.74197 8.87782 4.41567 9.78838 4.20418L9.86135 4.18977L9.86182 4.19024ZM6.98373 0C3.1249 0.00929615 0 3.13977 0 7C0 10.8658 3.13373 14 7 14C10.8663 14 14 10.8663 14 7C14 3.13977 10.8751 0.00929615 7.0172 0H7.01627C7.00542 0 6.99458 0 6.98373 0Z"
                fill="#25A1DF"
              />
            </svg>
            Telegram
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
                ? "px-[11.029px] py-[11.029px] text-[13.235px] tracking-[0.2647px]"
                : icon === "dark"
                  ? "px-[10.595px] py-[10.595px] text-[12.714px] tracking-[0.2543px]"
                  : "px-[10.588px] py-[10.588px] text-[12.706px] tracking-[0.2541px]";
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center justify-center gap-1 rounded-full text-[#ccc] transition-colors",
                  padding,
                  active
                    ? "border border-[#ccc] bg-[#3f4042]"
                    : "bg-[#303133]",
                )}
              >
                <ThemeIcon type={icon} />
                {label}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
