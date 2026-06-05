import { Skeleton } from "@/components/ui/skeleton";

export function WallpaperGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="aspect-[9/16] w-full bg-hw-surface sm:aspect-[16/10]"
        />
      ))}
    </div>
  );
}
