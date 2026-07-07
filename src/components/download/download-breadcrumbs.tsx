import Link from "next/link";
import { Home } from "lucide-react";
import type { WallpaperDetail } from "@/types/wallpaper";
import Image from "next/image";
import home from "../../../public/home.svg"
interface DownloadBreadcrumbsProps {
  wallpaper: WallpaperDetail;
}

export function DownloadBreadcrumbs({ wallpaper }: DownloadBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex h-[46px] w-full items-center justify-center gap-1.5 bg-hw-pill px-3 py-1.5 text-[12px] text-hw-muted"
    >
      <Link
        href="/"
        className="flex items-center  gap-1 transition-colors text-hw-foreground"
      >
        {/* <Home className="size-3.5" /> */}
        <Image src={home} alt="home" className="mb-1"/>
        <span className="text-[19px]">Home</span>
      </Link>
      <span className="text-hw-line text-[19px] font-bold">/</span>
      <Link
        href={`/?filter=${wallpaper.category}`}
        className="transition-colors text-hw-foreground text-[19px]"
      >
        {wallpaper.categoryLabel}
      </Link>
      <span className="text-hw-line text-[19px] font-bold">/</span>
      <span className="max-w-[200px] truncate text-hw-foreground sm:max-w-none text-[19px]">
        {wallpaper.title}
      </span>
    </nav>
  );
}
