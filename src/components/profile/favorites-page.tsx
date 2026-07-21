"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ProfileWallpaperThumb } from "@/components/profile/profile-wallpaper-thumb";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { useMyFavorites } from "@/hooks/use-my-favorites";
import { useAuth } from "@/context/auth-context";

/** One desktop row (lg:grid-cols-4). */
export const FAVORITES_PREVIEW_COUNT = 4;

/** API returns oldest-first; take the latest N, newest on the left. */
export function getRecentFavorites<T>(items: T[], count = FAVORITES_PREVIEW_COUNT): T[] {
  return items.slice(-count).reverse();
}

export function FavoritesPage() {
  const router = useRouter();
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const { wallpapers: favorites, loading } = useMyFavorites();

  useEffect(() => {
    if (authLoading) return;
    if (user) return;
    openAuthModal("signin");
    router.replace("/");
  }, [authLoading, user, openAuthModal, router]);

  if (authLoading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-hw-bg">
        <div className="size-8 animate-spin rounded-full border-2 border-hw-muted border-t-hw-foreground" />
      </div>
    );
  }

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
          Your Favorites
        </motion.h1>

        {loading ? (
          <p className="py-12 text-center text-sm text-hw-muted">
            Loading your favorites…
          </p>
        ) : favorites.length === 0 ? (
          <p className="py-12 text-center text-sm text-hw-muted">
            No favorites yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-2 lg:grid-cols-4">
            {favorites.map((wallpaper, index) => (
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
