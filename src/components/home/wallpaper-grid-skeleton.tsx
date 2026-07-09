import { Skeleton } from "@/components/ui/skeleton";

export function WallpaperGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid w-full grid-cols-2 gap-[var(--lp-grid-gap)] lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="mx-auto aspect-[198/440] w-full max-w-[198px] rounded-[var(--lp-card-radius)] bg-hw-surface lg:mx-0 lg:max-w-none lg:aspect-[449/254]"
        />
      ))}
    </div>
  );
}
