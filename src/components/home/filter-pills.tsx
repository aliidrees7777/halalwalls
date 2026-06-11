"use client";

import { Flame, Play, Rocket, Shuffle } from "lucide-react";
import { filterPills } from "@/data/filters";
import { useCategories } from "@/hooks/use-catalog";
import { cn } from "@/lib/utils";

const iconMap = {
  rocket: Rocket,
  play: Play,
  shuffle: Shuffle,
  flame: Flame,
};

const BROWSE_MODE_IDS = ["latest", "live", "random", "popular"];

// The 4 browse-mode pills (with icons) shown before the live category pills.
const browseModePills = filterPills.filter(
  (p) => p.icon || BROWSE_MODE_IDS.includes(p.id)
);

interface FilterPillsProps {
  active: string;
  onChange: (id: string) => void;
}

const pillClass = (isActive: boolean) =>
  cn(
    "flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors",
    isActive && "bg-hw-green text-black",
    !isActive && "bg-hw-pill text-hw-foreground hover:bg-hw-pill2-hover"
  );

export function FilterPills({ active, onChange }: FilterPillsProps) {
  const { categories } = useCategories();

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Wallpaper filters"
    >
      {browseModePills.map((pill) => {
        const Icon = pill.icon ? iconMap[pill.icon] : null;
        const isActive = active === pill.id;

        return (
          <button
            key={pill.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(pill.id)}
            className={pillClass(isActive)}
          >
            {Icon && <Icon className="size-3.5" />}
            {pill.label}
          </button>
        );
      })}

      {categories.map((category) => {
        const isActive = active === category.slug;

        return (
          <button
            key={category.slug}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category.slug)}
            className={pillClass(isActive)}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
