"use client";

import { SearchBox } from "@/components/shared/search-box";

interface WallpaperSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function WallpaperSearch({ value, onChange }: WallpaperSearchProps) {
  return (
    <div className="mx-auto w-full max-w-[var(--lp-search-max)]">
      <SearchBox
        value={value}
        onChange={onChange}
        heightClass="h-[var(--lp-search-h)]"
        textClass="text-[17.78px]"
        radiusClass="rounded-[var(--lp-search-radius)]"
      />
    </div>
  );
}
