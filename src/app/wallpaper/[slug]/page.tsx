import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DownloadPageClient } from "@/components/download/download-page";
import { ApiError } from "@/lib/api";
import {
  getRelatedWallpapers,
  getWallpaperBySlug,
} from "@/lib/wallpaper-data";
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

  // Live data from the backend so the wallpaper carries its real id (UUID),
  // favoritesCount, etc. — required for favorite/download actions to work.
  // Detail is required; related is best-effort so a pooler blip doesn't crash
  // the whole download page. Detail is shared with generateMetadata via cache().
  let wallpaper: WallpaperDetail;
  try {
    const detail = await getWallpaperBySlug(slug);
    wallpaper = detail.wallpaper;
  } catch (e) {
    if (e instanceof ApiError && e.statusCode === 404) notFound();
    throw e;
  }

  let related: Wallpaper[] = [];
  try {
    const relatedRes = await getRelatedWallpapers(slug);
    related = relatedRes.wallpapers;
  } catch {
    related = [];
  }

  return <DownloadPageClient wallpaper={wallpaper} related={related} />;
}
