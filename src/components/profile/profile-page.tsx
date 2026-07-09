"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ProfileBanner } from "@/components/profile/profile-banner";
import { ProfileSectionHeader } from "@/components/profile/profile-section-header";
import { ProfileCarouselSection } from "@/components/profile/profile-carousel-section";
import { ProfileCarouselThumb } from "@/components/profile/profile-carousel-thumb";
import { ProfileUploadCarouselCard } from "@/components/profile/profile-upload-carousel-card";
import { MobileAppBanner } from "@/components/shared/mobile-app-banner";
import {
  FAVORITES_PREVIEW_COUNT,
  getRecentFavorites,
} from "@/components/profile/favorites-page";
import {
  UPLOADS_PREVIEW_COUNT,
  getRecentUploads,
} from "@/components/profile/uploads-page";
import { ProfileWallpaperThumb } from "@/components/profile/profile-wallpaper-thumb";
import { UploadPlaceholder } from "@/components/profile/upload-placeholder";
import { SiteFooter } from "@/components/layout/site-footer";
import { useAuth } from "@/context/auth-context";
import { useMyFavorites } from "@/hooks/use-my-favorites";
import { useMyUploads } from "@/hooks/use-my-uploads";
import {
  demoProfileUser,
  discoverJustUploaded,
  type ProfileUser,
} from "@/data/profile-user";
import { SiteHeader } from "../home/site-header";

export function ProfilePage() {
  const { user, loading, refreshMe } = useAuth();
  const { wallpapers: favorites, loading: favoritesLoading } = useMyFavorites();
  const { wallpapers: uploads, loading: uploadsLoading } = useMyUploads();

  useEffect(() => {
    if (!user) return;
    void refreshMe();
  }, [user?.id, refreshMe]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-hw-bg">
        <div className="size-8 animate-spin rounded-full border-2 border-hw-muted border-t-hw-foreground" />
      </div>
    );
  }

  const profileUser: ProfileUser = user
    ? {
        id: user.id,
        name: user.name || user.email,
        bio: user.bio || "",
        email: user.email,
        avatar: user.avatar || demoProfileUser.avatar,
        banner: user.banner || demoProfileUser.banner,
        isPremium: user.isPremium,
        favoritesCount: user.favoritesCount || user.favorites.length,
        uploadsCount: user.uploadsCount ?? 0,
      }
    : demoProfileUser;

  const recentFavorites = getRecentFavorites(favorites);
  const recentUploads = getRecentUploads(uploads);

  return (
    <>
      {/* Mobile — Figma Menu and Profile & Body @ 412px */}
      <div className="min-h-screen bg-[#1d2021] md:hidden">
        <SiteHeader />
        <ProfileBanner user={profileUser} />

        <div className="flex flex-col items-center pt-[30px]">
          <div className="flex w-full max-w-[412px] flex-col gap-[30px] px-[6px]">
            <ProfileCarouselSection title="Discover Just Uploaded" seeAllHref="/">
              {discoverJustUploaded.map((wallpaper) => (
                <ProfileCarouselThumb key={wallpaper.id} wallpaper={wallpaper} />
              ))}
            </ProfileCarouselSection>

            <ProfileCarouselSection
              title="Your Uploads"
              seeAllHref={
                uploads.length > UPLOADS_PREVIEW_COUNT ? "/profile/uploads" : "/profile/uploads"
              }
              carouselHeightClass="h-[279px]"
              itemGapClass="gap-1.5 pl-px"
            >
              <ProfileUploadCarouselCard />
              {uploadsLoading
                ? null
                : recentUploads.map((wallpaper) => (
                    <ProfileCarouselThumb key={wallpaper.id} wallpaper={wallpaper} />
                  ))}
            </ProfileCarouselSection>

            <ProfileCarouselSection
              title="Your Favorites"
              seeAllHref={
                favorites.length > FAVORITES_PREVIEW_COUNT
                  ? "/profile/favorites"
                  : "/profile/favorites"
              }
            >
              {favoritesLoading ? null : recentFavorites.length > 0 ? (
                recentFavorites.map((wallpaper) => (
                  <ProfileCarouselThumb key={wallpaper.id} wallpaper={wallpaper} />
                ))
              ) : (
                <div className="flex h-full w-[124.2px] shrink-0 items-center justify-center rounded-[3.802px] border-[0.634px] border-[#5b6268] bg-[#181a1b] px-2 text-center text-[10px] text-[#a8a299]">
                  No favorites yet
                </div>
              )}
            </ProfileCarouselSection>
          </div>

          <div className="mt-[60px] flex w-full flex-col items-center gap-[60px] px-4">
            <MobileAppBanner />
            <SiteFooter />
          </div>
        </div>
      </div>

      {/* Desktop / tablet */}
      <div className="hidden min-h-screen bg-hw-bg md:block">
        <SiteHeader />
        <main className="mx-auto max-w-[1650px] px-4 py-8 lg:px-6 lg:py-10">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-center text-xl font-bold text-hw-account sm:mb-8 sm:text-[39px]"
          >
            My Account
          </motion.h1>

          <ProfileBanner user={profileUser} />

          <section>
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-2xl font-semibold text-hw-account lg:text-4xl">
                Discover Just Uploaded
              </h2>
              <ProfileSectionHeader title="" seeAllHref="/" className="text-right" />
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {discoverJustUploaded.map((wallpaper, index) => (
                <ProfileWallpaperThumb
                  key={wallpaper.id}
                  wallpaper={wallpaper}
                  index={index}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="my-10 flex items-end justify-between">
              <h2 className="text-2xl font-semibold text-hw-account lg:text-4xl">
                Your Uploads
              </h2>
              <ProfileSectionHeader
                title=""
                seeAllHref={
                  uploads.length > UPLOADS_PREVIEW_COUNT ? "/profile/uploads" : null
                }
              />
            </div>
            {uploadsLoading ? (
              <p className="py-12 text-center text-sm text-hw-muted">
                Loading your uploads…
              </p>
            ) : uploads.length === 0 ? (
              <UploadPlaceholder />
            ) : (
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {recentUploads.map((wallpaper, index) => (
                  <ProfileWallpaperThumb
                    key={wallpaper.id}
                    wallpaper={wallpaper}
                    index={index}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-2xl font-semibold text-hw-account lg:text-4xl">
                Your Favorites
              </h2>
              <ProfileSectionHeader
                title=""
                seeAllHref={
                  favorites.length > FAVORITES_PREVIEW_COUNT
                    ? "/profile/favorites"
                    : null
                }
              />
            </div>
            {favoritesLoading ? (
              <p className="py-12 text-center text-sm text-hw-muted">
                Loading your favorites…
              </p>
            ) : favorites.length === 0 ? (
              <p className="py-12 text-center text-sm text-hw-muted">
                No favorites yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {recentFavorites.map((wallpaper, index) => (
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
