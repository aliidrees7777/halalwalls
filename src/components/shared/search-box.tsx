"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Wallpaper search box. Matches the Figma "Search bar" frame:
 * #181A1B bg, 1px #3E4446 border, ~4px radius, "Search for wallpapers..."
 * placeholder in #C8C3BC @50%, and the magnifier (submit button) in its own
 * right segment separated by a vertical divider.
 *
 * Pass `onSubmit` to make Enter / magnifier-click navigate (used by headers).
 * The homepage filters live via `onChange`, so it omits `onSubmit`.
 */
interface SearchBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
  heightClass?: string;
  textClass?: string;
  radiusClass?: string;
}

export function SearchBox({
  value,
  onChange,
  onSubmit,
  className,
  heightClass = "h-9",
  textClass = "text-[13px]",
  radiusClass = "rounded-[5px]",
}: SearchBoxProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value ?? "");
      }}
      className={cn(
        "flex items-center overflow-hidden border border-[#3E4446] bg-hw-input",
        radiusClass,
        heightClass,
        className,
      )}
      role="search"
    >
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Search for wallpapers..."
        aria-label="Search wallpapers"
        className={cn(
          "h-full flex-1 bg-transparent px-4 font-medium text-hw-content outline-none placeholder:text-hw-content/50 [&::-webkit-search-cancel-button]:appearance-none",
          textClass,
        )}
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex h-full shrink-0 items-center border-l border-[#3E4446] px-3 text-hw-content transition-colors hover:text-hw-foreground"
      >
        <Search className="size-5" />
      </button>
    </form>
  );
}
