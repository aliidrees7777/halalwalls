import { Skeleton } from "@/components/ui/skeleton";

export function WallpaperGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-[var(--lp-grid-gap)] lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="aspect-[449/254] w-full rounded-[var(--lp-card-radius)] bg-hw-surface"
        />
      ))}
    </div>
  );
}
