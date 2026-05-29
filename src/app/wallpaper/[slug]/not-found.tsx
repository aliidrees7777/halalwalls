import Link from "next/link";
import { DownloadHeader } from "@/components/download/download-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function WallpaperNotFound() {
  return (
    <div className="min-h-screen bg-hw-bg">
      <DownloadHeader />
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-hw-green">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold text-hw-foreground">
          Wallpaper not found
        </h1>
        <p className="mt-3 text-[14px] text-hw-muted">
          This wallpaper may have been removed or the link is incorrect.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-10 items-center justify-center rounded-lg bg-hw-green px-6 text-sm font-medium text-hw-bg transition-colors hover:bg-hw-green/90"
        >
          Back to Home
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}
