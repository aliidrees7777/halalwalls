import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DownloadPageClient } from "@/components/download/download-page";
import { api, ApiError } from "@/lib/api";
import type { Wallpaper, WallpaperDetail } from "@/types/wallpaper";
import {
  getWallpaperDetail,
  getRelatedForDetail,
} from "@/data/wallpaper-details";

export const dynamic = "force-dynamic";

interface WallpaperPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: WallpaperPageProps): Promise<Metadata> {
  const { slug } = await params;
  const wallpaper = getWallpaperDetail(slug);
  if (!wallpaper) return { title: "Wallpaper Not Found — HalalWalls" };

  return {
    title: `${wallpaper.title} — Download HD Wallpaper | HalalWalls`,
    description: `Download ${wallpaper.title} in ${wallpaper.preferredResolution} and more resolutions. Free ${wallpaper.categoryLabel} wallpaper by ${wallpaper.author}.`,
  };
  // try {
  //   const { wallpaper } = await api.get<{ wallpaper: WallpaperDetail }>(
  //     `/wallpapers/${slug}`
  //   );

  //   return {
  //     title: `${wallpaper.title} — Download HD Wallpaper | HalalWalls`,
  //     description: `Download ${wallpaper.title} in ${wallpaper.preferredResolution} and more resolutions. Free ${wallpaper.categoryLabel} wallpaper by ${wallpaper.author}.`,
  //   };
  // } catch {
  //   return { title: "Wallpaper Not Found — HalalWalls" };
  // }
}

export default async function WallpaperDownloadPage({
  params,
}: WallpaperPageProps) {
  const { slug } = await params;

  const wallpaper = getWallpaperDetail(slug);
  if (!wallpaper) return notFound();

  const related = getRelatedForDetail(wallpaper);
  // Fetch inside try/catch, but render the JSX OUTSIDE it so render-time errors
  // aren't swallowed (and to satisfy react-hooks/error-boundaries).
  // let wallpaper: WallpaperDetail;
  // let related: Wallpaper[];
  // try {
  //   ({ wallpaper } = await api.get<{ wallpaper: WallpaperDetail }>(
  //     `/wallpapers/${slug}`,
  //     { cache: "no-store" }
  //   ));
  //   ({ wallpapers: related } = await api.get<{ wallpapers: Wallpaper[] }>(
  //     `/wallpapers/${slug}/related`
  //   ));
  // } catch (e) {
  //   if (e instanceof ApiError && e.statusCode === 404) notFound();
  //   throw e;
  // }

  return <DownloadPageClient wallpaper={wallpaper} related={related} />;
}



// import { notFound } from "next/navigation";
// import type { Metadata } from "next";
// import { DownloadPageClient } from "@/components/download/download-page";
// import type { Wallpaper, WallpaperDetail } from "@/types/wallpaper";


// export const dynamic = "force-dynamic";

// interface WallpaperPageProps {
//   params: Promise<{ slug: string }>;
// }

// export async function generateMetadata({ params }: WallpaperPageProps): Promise<Metadata> {
//   const { slug } = await params;
//   const wallpaper = getWallpaperDetail(slug);
//   if (!wallpaper) return { title: "Wallpaper Not Found — HalalWalls" };

//   return {
//     title: `${wallpaper.title} — Download HD Wallpaper | HalalWalls`,
//     description: `Download ${wallpaper.title} in ${wallpaper.preferredResolution} and more resolutions. Free ${wallpaper.categoryLabel} wallpaper by ${wallpaper.author}.`,
//   };
// }

// export default async function WallpaperDownloadPage({ params }: WallpaperPageProps) {
//   const { slug } = await params;


//   return <DownloadPageClient wallpaper={wallpaper} related={related} />;
// }