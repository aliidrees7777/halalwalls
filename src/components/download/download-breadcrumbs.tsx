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
      className="flex min-h-[46px] w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 bg-[#f2f2f2] px-0 py-1.5 text-center text-[12px] leading-snug dark:bg-hw-pill dark:text-hw-muted max-lg:-mx-3 max-lg:w-[calc(100%+1.5rem)] lg:h-[46px] lg:flex-nowrap lg:px-3 lg:py-1.5"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1 font-bold text-black transition-colors hover:opacity-80 dark:text-hw-foreground"
      >
        <Image src={homeLight} alt="" className="mb-1 dark:hidden" />
        <Image src={homeDark} alt="" className="mb-1 hidden dark:block" />
        <span className="text-[19px] font-bold">Home</span>
      </Link>
      <span className="text-[19px] font-normal text-black dark:text-hw-line">
        /
      </span>
      <Link
        href={`/?category=${wallpaper.category}`}
        className="text-[19px] font-bold text-black transition-colors hover:opacity-80 dark:text-hw-foreground"
      >
        {wallpaper.categoryLabel}
      </Link>
      <span className="text-[19px] font-normal text-black dark:text-hw-line">
        /
      </span>
      <span className="text-[19px] font-normal text-black/70 dark:text-hw-muted lg:max-w-none">
        {wallpaper.title}
      </span>
    </nav>
  );
}
