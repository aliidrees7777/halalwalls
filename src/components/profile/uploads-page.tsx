"use client";

import { motion } from "framer-motion";
import { ProfileWallpaperThumb } from "@/components/profile/profile-wallpaper-thumb";
import { UploadPlaceholder } from "@/components/profile/upload-placeholder";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { useMyUploads } from "@/hooks/use-my-uploads";

/** One desktop row (lg:grid-cols-4). */
export const UPLOADS_PREVIEW_COUNT = 4;

/** API returns newest-first; take the latest N. */
export function getRecentUploads<T>(items: T[], count = UPLOADS_PREVIEW_COUNT): T[] {
  return items.slice(0, count);
}

export function UploadsPage() {
  const { wallpapers: uploads, loading } = useMyUploads();

  return (
    <div className="min-h-screen bg-hw-bg">
      <SiteHeader />
      <main className="mx-auto max-w-[1650px] px-4 py-8 lg:px-6 lg:py-10">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-2xl font-semibold text-hw-account lg:text-4xl"
        >
          Your Uploads
        </motion.h1>

        {loading ? (
          <p className="py-12 text-center text-sm text-hw-muted">
            Loading your uploads…
          </p>
        ) : uploads.length === 0 ? (
          <UploadPlaceholder />
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-2 lg:grid-cols-4">
            {uploads.map((wallpaper, index) => (
              <ProfileWallpaperThumb
                key={wallpaper.id}
                wallpaper={wallpaper}
                index={index}
              />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
