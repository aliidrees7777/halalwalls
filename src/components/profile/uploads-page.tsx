"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ProfileWallpaperThumb } from "@/components/profile/profile-wallpaper-thumb";
import { UploadPlaceholder } from "@/components/profile/upload-placeholder";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { useMyUploads } from "@/hooks/use-my-uploads";
import { useAuth } from "@/context/auth-context";
import { LoadingBlock, LoadingSpinner } from "@/components/shared/loading-spinner";

/**
 * Desktop preview reserves the leftmost grid slot for "Add Wallpaper",
 * so only the latest 3 uploads are shown on the profile page.
 */
export const UPLOADS_PREVIEW_COUNT = 3;

/** API returns newest-first; take the latest N. */
export function getRecentUploads<T>(items: T[], count = UPLOADS_PREVIEW_COUNT): T[] {
  return items.slice(0, count);
}

export function UploadsPage() {
  const router = useRouter();
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const { wallpapers: uploads, loading } = useMyUploads();

  useEffect(() => {
    if (authLoading) return;
    if (user) return;
    openAuthModal("signin");
    router.replace("/");
  }, [authLoading, user, openAuthModal, router]);

  if (authLoading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-hw-bg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hw-bg">
      <SiteHeader />
      <main className="mx-auto max-w-[1650px] px-2 pb-[60px] pt-8 md:px-4 md:py-8 lg:px-6 lg:py-10">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center text-2xl font-semibold text-hw-account lg:text-4xl"
        >
          Your Uploads
        </motion.h1>

        {loading ? (
          <LoadingBlock />
        ) : (
          <div className="grid grid-cols-3 gap-2 md:grid-cols-2 lg:grid-cols-4">
            <UploadPlaceholder className="aspect-[124.2/276] max-w-none rounded-[4px] md:aspect-[16/10] md:rounded-[var(--lp-card-radius)]" />
            {uploads.map((wallpaper, index) => (
              <ProfileWallpaperThumb
                key={wallpaper.id}
                wallpaper={wallpaper}
                index={index}
                mediaClassName="aspect-[124.2/276] rounded-[4px] md:aspect-[16/10] md:rounded-[var(--lp-card-radius)]"
              />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
