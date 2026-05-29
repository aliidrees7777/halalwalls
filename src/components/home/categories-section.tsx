"use client";

import {
  LayoutGrid,
  UtensilsCrossed,
  Soup,
  Flame,
  Beef,
  Fish,
  Coffee,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { categories } from "@/data/categories";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  UtensilsCrossed,
  Soup,
  Flame,
  Beef,
  Fish,
  Coffee,
  Wine,
};

export function CategoriesSection() {
  return (
    <section className="bg-muted/20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Browse"
            title="Explore by cuisine"
            description="From street food to fine dining — find halal options for every craving."
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <StaggerContainer className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] ?? LayoutGrid;
            return (
              <StaggerItem key={cat.id}>
                <button
                  type="button"
                  className={cn(
                    "group flex w-full flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-5 text-center transition-all",
                    "hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:shadow-lg hover:shadow-emerald-500/5"
                  )}
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-500/20 dark:text-emerald-400">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{cat.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {cat.count.toLocaleString()} places
                    </p>
                  </div>
                </button>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
