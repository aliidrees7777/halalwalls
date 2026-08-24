import { LoadingSpinner } from "@/components/shared/loading-spinner";

/**
 * Shown immediately on client navigations to /wallpaper/[slug] while the
 * server finishes the detail fetch. Without this, Next.js App Router holds
 * the previous page until the RSC payload is ready.
 */
export default function WallpaperLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-hw-bg">
      <LoadingSpinner size="lg" label="Loading wallpaper" />
    </div>
  );
}
