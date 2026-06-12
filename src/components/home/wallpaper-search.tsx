"use client";

import { SearchBox } from "@/components/shared/search-box";

interface WallpaperSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function WallpaperSearch({ value, onChange }: WallpaperSearchProps) {
  return (
    <div className="mx-auto w-full max-w-[790px] ">
      <SearchBox value={value} onChange={onChange} heightClass="h-11" textClass="text-[18px]" />
    </div>
  );
}
