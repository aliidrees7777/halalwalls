"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ProfileHeaderNav } from "@/components/profile/profile-header-nav";
import { ProfileBanner } from "@/components/profile/profile-banner";
import { ProfileSectionHeader } from "@/components/profile/profile-section-header";
import { ProfileWallpaperThumb } from "@/components/profile/profile-wallpaper-thumb";
import { UploadPlaceholder } from "@/components/profile/upload-placeholder";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileProfile } from "@/components/profile/mobile-profile";
import { useAuth } from "@/context/auth-context";
import { useMyFavorites } from "@/hooks/use-my-favorites";
import { useMyUploads } from "@/hooks/use-my-uploads";
import {
  demoProfileUser,
  discoverJustUploaded,
  type ProfileUser,
} from "@/data/profile-user";

export function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { wallpapers: favorites, loading: favoritesLoading } = useMyFavorites();
  const { wallpapers: uploads } = useMyUploads();

  // Auth guard: redirect guests to /login.
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-hw-bg">
        <div className="size-8 animate-spin rounded-full border-2 border-hw-muted border-t-hw-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const profileUser: ProfileUser = {
    id: user.id,
    name: user.name || user.email,
    bio: user.bio || "",
    email: user.email,
    avatar: user.avatar || demoProfileUser.avatar,
    banner: user.banner || demoProfileUser.banner,
    isPremium: user.isPremium,
    favoritesCount: user.favoritesCount,
    uploadsCount: user.uploadsCount ?? 0,
  };

  return (
    <>
      {/* Mobile: immersive app-style profile (matches Figma) */}
      <div className="md:hidden">
        <MobileProfile />
      </div>

      {/* Desktop / tablet */}
      <div className="hidden min-h-screen bg-hw-bg md:block">
      <ProfileHeaderNav />

      <main className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6 lg:py-10">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-center text-xl font-semibold text-hw-foreground sm:mb-8 sm:text-2xl"
        >
          My Account
        </motion.h1>

        <ProfileBanner user={profileUser} />

        <section className="mt-10 sm:mt-12">
          <ProfileSectionHeader title="Discover Just Uploaded" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {discoverJustUploaded.map((wallpaper, index) => (
              <ProfileWallpaperThumb
                key={wallpaper.id}
                wallpaper={wallpaper}
                index={index}
              />
            ))}
          </div>
        </section>

        <section className="mt-10 sm:mt-12">
          <ProfileSectionHeader title="Your Uploads" seeAllHref={null} />
          {uploads.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {uploads.map((wallpaper, index) => (
                <ProfileWallpaperThumb
                  key={wallpaper.id}
                  wallpaper={wallpaper}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <UploadPlaceholder />
          )}
        </section>

        <section className="mt-10 sm:mt-12">
          <ProfileSectionHeader title="Your Favorites" />
          {favorites.length === 0 && !favoritesLoading ? (
            <p className="py-12 text-center text-sm text-hw-muted">
              No favorites yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {favorites.map((wallpaper, index) => (
                <ProfileWallpaperThumb
                  key={wallpaper.id}
                  wallpaper={wallpaper}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
      </div>
    </>
  );
}
