"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface WallpaperSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function WallpaperSearch({ value, onChange }: WallpaperSearchProps) {
  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <Input
        type="search"
        placeholder="Search for wallpapers..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg border-[#2a2f2d] bg-hw-search-input pr-11 text-[14px] text-hw-foreground shadow-none placeholder:text-hw-muted focus-visible:border-hw-green/40 focus-visible:ring-hw-green/15"
        aria-label="Search wallpapers"
      />
      <Search className="pointer-events-none absolute right-4 top-1/2 size-[18px] -translate-y-1/2 text-hw-foreground/80" />
    </div>
  );
}
