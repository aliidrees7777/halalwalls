"use client";

import { cn } from "@/lib/utils";

interface ResolutionChipsProps {
  resolutions: string[];
  columns?: 3 | 2;
  onSelect?: (resolution: string) => void;
  className?: string;
}

export function ResolutionChips({
  resolutions,
  columns = 3,
  onSelect,
  className,
}: ResolutionChipsProps) {
  return (
    <div
      className={cn(
        "grid gap-1.5",
        columns === 3 ? "grid-cols-3" : "grid-cols-2",
        className
      )}
    >
      {resolutions.map((res) => (
        <button
          key={res}
          type="button"
          onClick={() => onSelect?.(res)}
          className="rounded-md border border-hw-line bg-hw-deep px-1 py-2 text-center text-[11px] leading-tight text-hw-foreground transition-colors hover:border-hw-green/40 hover:text-hw-green"
        >
          {res}
        </button>
      ))}
    </div>
  );
}
