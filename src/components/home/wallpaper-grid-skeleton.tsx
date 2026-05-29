import { Skeleton } from "@/components/ui/skeleton";

export function WallpaperGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="aspect-[16/10] w-full bg-hw-surface"
        />
      ))}
    </div>
  );
}
