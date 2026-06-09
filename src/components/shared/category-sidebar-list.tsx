import Link from "next/link";
import { cn } from "@/lib/utils";
import type { FilterId } from "@/types/wallpaper";
import type { SidebarCategory } from "@/types/wallpaper";

function CategoryBadge({
  count,
  isPremium,
}: {
  count: number;
  isPremium?: boolean;
}) {
  return (
    <span
      className={cn(
        "min-w-[28px] rounded-full px-2 py-0.5 text-center text-[11px] font-medium tabular-nums text-hw-foreground",
        isPremium
          ? "border border-hw-yellow bg-transparent"
          : "bg-[#2a2f2d]"
      )}
    >
      {count}
    </span>
  );
}

interface CategorySidebarListProps {
  categories: SidebarCategory[];
  activeCategory?: FilterId;
}

export function CategorySidebarList({
  categories,
  activeCategory,
}: CategorySidebarListProps) {
  return (
    <ul>
      {categories.map((category, index) => {
        const isActive =
          category.slug && activeCategory && category.slug === activeCategory;

        return (
          <li
            key={category.name}
            className={cn(index > 0 && "border-t border-[#2a2f2d]")}
          >
            <Link
              href={category.slug ? `/?category=${category.slug}` : "/"}
              className={cn(
                "flex items-center justify-between gap-2 py-2.5 transition-colors",
                isActive && "rounded-md bg-[#2a2f2d] px-2 -mx-2"
              )}
            >
              <span
                className={cn(
                  "text-[13px]",
                  category.isPremium
                    ? "font-medium text-hw-yellow"
                    : isActive
                      ? "text-hw-foreground"
                      : "text-hw-foreground"
                )}
              >
                {category.isPremium ? `${category.name} 💎` : category.name}
              </span>
              <CategoryBadge
                count={category.count}
                isPremium={category.isPremium}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
