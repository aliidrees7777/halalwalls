"use client";

import { Flame, Play, Rocket, Shuffle } from "lucide-react";
import { filterPills } from "@/data/filters";
import type { FilterId } from "@/types/wallpaper";
import { cn } from "@/lib/utils";

const iconMap = {
  rocket: Rocket,
  play: Play,
  shuffle: Shuffle,
  flame: Flame,
};

interface FilterPillsProps {
  active: FilterId;
  onChange: (id: FilterId) => void;
}

export function FilterPills({ active, onChange }: FilterPillsProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Wallpaper filters"
    >
      {filterPills.map((pill) => {
        const Icon = pill.icon ? iconMap[pill.icon] : null;
        const isActive = active === pill.id;

        return (
          <button
            key={pill.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(pill.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors",
              isActive && "bg-hw-green text-black",
              !isActive && "bg-hw-pill text-hw-foreground hover:bg-[#252525]"
            )}
          >
            {Icon && <Icon className="size-3.5" />}
            {pill.label}
          </button>
        );
      })}
    </div>
  );
}
