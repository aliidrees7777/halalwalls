import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DownloadPageClient } from "@/components/download/download-page";
import { ApiError } from "@/lib/api";
import { getWallpaperBySlug } from "@/lib/wallpaper-data";
import type { Wallpaper, WallpaperDetail } from "@/types/wallpaper";

/**
 * Route-level ISR window (seconds). Must be a numeric literal for Next’s
 * static analysis — keep in sync with WALLPAPER_REVALIDATE_SECONDS.
 */
export const revalidate = 60;

interface WallpaperPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: WallpaperPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { wallpaper } = await getWallpaperBySlug(slug);
    return {
      title: `${wallpaper.title} — Download HD Wallpaper | HalalWalls`,
      description: `Download ${wallpaper.title} in ${wallpaper.preferredResolution} and more resolutions. Free ${wallpaper.categoryLabel} wallpaper by ${wallpaper.author}.`,
    };
  } catch {
    return { title: "Wallpaper Not Found — HalalWalls" };
  }
}

export default async function WallpaperDownloadPage({
  params,
}: WallpaperPageProps) {
  const { slug } = await params;

  // One backend round trip: detail + related cards (shared with generateMetadata
  // via React.cache). Related is optional so a thin response still renders.
  let wallpaper: WallpaperDetail;
  let related: Wallpaper[] = [];
  try {
    const detail = await getWallpaperBySlug(slug);
    wallpaper = detail.wallpaper;
    related = detail.related ?? [];
  } catch (e) {
    if (e instanceof ApiError && e.statusCode === 404) notFound();
    throw e;
  }

  return <DownloadPageClient wallpaper={wallpaper} related={related} />;
}
