import { LoadingSpinner } from "@/components/shared/loading-spinner";

/**
 * Shown immediately on client navigations to /wallpaper/[slug] while the
 * server finishes fetching wallpaper + related data. Without this, Next.js
 * App Router holds the previous page until the RSC payload is ready (~2–3s).
 */
export default function WallpaperLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-hw-bg">
      <LoadingSpinner size="lg" label="Loading wallpaper" />
    </div>
  );
}
