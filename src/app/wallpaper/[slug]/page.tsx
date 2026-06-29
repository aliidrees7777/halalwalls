import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DownloadPageClient } from "@/components/download/download-page";
import { api, ApiError } from "@/lib/api";
import type { Wallpaper, WallpaperDetail } from "@/types/wallpaper";

export const dynamic = "force-dynamic";

interface WallpaperPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: WallpaperPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { wallpaper } = await api.get<{ wallpaper: WallpaperDetail }>(
      `/wallpapers/${slug}`,
    );
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

  // Live data from the backend so the wallpaper carries its real id (UUID),
  // favoritesCount, etc. — required for favorite/download actions to work.
  let wallpaper: WallpaperDetail;
  let related: Wallpaper[];
  try {
    ({ wallpaper } = await api.get<{ wallpaper: WallpaperDetail }>(
      `/wallpapers/${slug}`,
      { cache: "no-store" },
    ));
    ({ wallpapers: related } = await api.get<{ wallpapers: Wallpaper[] }>(
      `/wallpapers/${slug}/related`,
    ));
  } catch (e) {
    if (e instanceof ApiError && e.statusCode === 404) notFound();
    throw e;
  }

  return <DownloadPageClient wallpaper={wallpaper} related={related} />;
}
