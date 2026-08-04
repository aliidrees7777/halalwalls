import Link from "next/link";
import type { WallpaperDetail } from "@/types/wallpaper";
import Image from "next/image";
import homeDark from "../../../public/home.svg";
import homeLight from "../../../public/Home-light-mode.svg";

interface DownloadBreadcrumbsProps {
  wallpaper: WallpaperDetail;
}

export function DownloadBreadcrumbs({ wallpaper }: DownloadBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex h-[46px] w-full items-center justify-center gap-1.5 bg-[#f2f2f2] px-3 py-1.5 text-[12px] dark:bg-hw-pill dark:text-hw-muted"
    >
      <Link
        href="/"
        className="flex items-center gap-1 font-bold text-black transition-colors hover:opacity-80 dark:font-medium dark:text-hw-foreground"
      >
        <Image src={homeLight} alt="" className="mb-1 dark:hidden" />
        <Image src={homeDark} alt="" className="mb-1 hidden dark:block" />
        <span className="text-[19px]">Home</span>
      </Link>
      <span className="text-[19px] font-bold text-black dark:text-hw-line">
        /
      </span>
      <Link
        href={`/?category=${wallpaper.category}`}
        className="text-[19px] font-bold text-black transition-colors hover:opacity-80 dark:font-medium dark:text-hw-foreground"
      >
        {wallpaper.categoryLabel}
      </Link>
      <span className="text-[19px] font-bold text-black dark:text-hw-line">
        /
      </span>
      <span className="max-w-[200px] truncate text-[19px] font-normal text-black sm:max-w-none dark:text-hw-foreground">
        {wallpaper.title}
      </span>
    </nav>
  );
}
