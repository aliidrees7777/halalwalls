import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DownloadPageClient } from "@/components/download/download-page";
import {
  getAllWallpaperSlugs,
  getWallpaperDetail,
} from "@/data/wallpaper-details";

interface WallpaperPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllWallpaperSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WallpaperPageProps): Promise<Metadata> {
  const { slug } = await params;
  const wallpaper = getWallpaperDetail(slug);

  if (!wallpaper) {
    return { title: "Wallpaper Not Found — HalalWalls" };
  }

  return {
    title: `${wallpaper.title} — Download HD Wallpaper | HalalWalls`,
    description: `Download ${wallpaper.title} in ${wallpaper.preferredResolution} and more resolutions. Free ${wallpaper.categoryLabel} wallpaper by ${wallpaper.author}.`,
  };
}

export default async function WallpaperDownloadPage({
  params,
}: WallpaperPageProps) {
  const { slug } = await params;
  const wallpaper = getWallpaperDetail(slug);

  if (!wallpaper) {
    notFound();
  }

  return <DownloadPageClient wallpaper={wallpaper} />;
}
