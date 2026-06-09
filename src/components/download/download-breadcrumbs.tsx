import Link from "next/link";
import { Home } from "lucide-react";
import type { WallpaperDetail } from "@/types/wallpaper";

interface DownloadBreadcrumbsProps {
  wallpaper: WallpaperDetail;
}

export function DownloadBreadcrumbs({ wallpaper }: DownloadBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="inline-flex items-center gap-1.5 rounded-md border border-hw-line bg-hw-deep px-3 py-1.5 text-[12px] text-hw-muted"
    >
      <Link
        href="/"
        className="flex items-center gap-1 transition-colors hover:text-hw-foreground"
      >
        <Home className="size-3.5" />
        <span>Home</span>
      </Link>
      <span className="text-hw-line">/</span>
      <Link
        href={`/?filter=${wallpaper.category}`}
        className="transition-colors hover:text-hw-foreground"
      >
        {wallpaper.categoryLabel}
      </Link>
      <span className="text-hw-line">/</span>
      <span className="max-w-[200px] truncate text-hw-foreground sm:max-w-none">
        {wallpaper.title}
      </span>
    </nav>
  );
}
