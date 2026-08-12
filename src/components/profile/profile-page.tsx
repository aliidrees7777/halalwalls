"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ProfileBanner } from "@/components/profile/profile-banner";
import { DesktopProfileBanner } from "@/components/profile/desktop-profile-banner";
import { ProfileSectionHeader } from "@/components/profile/profile-section-header";
import { ProfileCarouselSection } from "@/components/profile/profile-carousel-section";
import { ProfileCarouselThumb } from "@/components/profile/profile-carousel-thumb";
import { ProfileUploadCarouselCard } from "@/components/profile/profile-upload-carousel-card";
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
import { LoadingBlock, LoadingSpinner } from "@/components/shared/loading-spinner";
import { useMyUploads } from "@/hooks/use-my-uploads";
import { api } from "@/lib/api";
import type { Wallpaper } from "@/types/wallpaper";
import { demoProfileUser, type ProfileUser } from "@/data/profile-user";
import { upgradeAvatarUrl } from "@/lib/media-url";
import { SiteHeader } from "../home/site-header";

const DISCOVER_LIMIT = 4;

export function ProfilePage() {
  const router = useRouter();
  const { user, loading, refreshMe, openAuthModal } = useAuth();
  const { wallpapers: favorites, loading: favoritesLoading } = useMyFavorites();
  const { wallpapers: uploads, loading: uploadsLoading } = useMyUploads();
  const [justUploaded, setJustUploaded] = useState<Wallpaper[]>([]);
  const [justUploadedLoading, setJustUploadedLoading] = useState(true);

  // Guests cannot view /profile — redirect home and open sign-in (mobile + desktop).
  useEffect(() => {
    if (loading) return;
    if (user) return;
    openAuthModal("signin");
    router.replace("/");
  }, [loading, user, openAuthModal, router]);

  useEffect(() => {
    if (!user) return;
    void refreshMe();
  }, [user?.id, refreshMe]);

  // Same source as homepage default: latest published wallpapers.
  useEffect(() => {
    if (!user) return;
    let ignore = false;
    setJustUploadedLoading(true);
    api
      .get<{ wallpapers: Wallpaper[] }>(
        `/wallpapers?sort=latest&limit=${DISCOVER_LIMIT}&page=1`,
      )
      .then((data) => {
        if (ignore) return;
        setJustUploaded(data.wallpapers ?? []);
      })
      .catch(() => {
        if (ignore) return;
        setJustUploaded([]);
      })
      .finally(() => {
        if (ignore) return;
        setJustUploadedLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [user?.id]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-hw-bg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const profileUser: ProfileUser = {
    id: user.id,
    name: user.name || user.email,
    bio: user.bio || "",
    email: user.email,
    avatar: upgradeAvatarUrl(user.avatar, 512) || demoProfileUser.avatar,
    banner: user.banner || demoProfileUser.banner,
    isPremium: user.isPremium,
    favoritesCount: user.favoritesCount || user.favorites.length,
    uploadsCount: user.uploadsCount ?? 0,
  };

  const recentFavorites = getRecentFavorites(favorites);
  const recentUploads = getRecentUploads(uploads);

  return (
    <>
      {/* Mobile — Figma Menu and Profile & Body @ 412px */}
      <div className="min-h-screen bg-hw-bg md:hidden">
        <SiteHeader />
        <ProfileBanner user={profileUser} />

        <div className="flex flex-col items-center gap-[60px] pt-[30px]">
          <div className="flex w-full max-w-[412px] flex-col gap-[30px] px-[6px]">
            <ProfileCarouselSection title="Discover Just Uploaded" seeAllHref="/">
              {justUploadedLoading
                ? null
                : justUploaded.map((wallpaper) => (
                    <ProfileCarouselThumb key={wallpaper.id} wallpaper={wallpaper} />
                  ))}
            </ProfileCarouselSection>

            <ProfileCarouselSection
              title="Your Uploads"
              seeAllHref={
                uploads.length > UPLOADS_PREVIEW_COUNT ? "/profile/uploads" : "/profile/uploads"
              }
              carouselHeightClass="h-[272px]"
              itemGapClass="gap-1.5 pl-px"
            >
              {uploadsLoading ? null : (
                <>
                  <ProfileUploadCarouselCard />
                  {recentUploads.map((wallpaper) => (
                    <ProfileCarouselThumb key={wallpaper.id} wallpaper={wallpaper} />
                  ))}
                </>
              )}
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
                <div className="flex h-full w-[124.2px] shrink-0 items-center justify-center rounded-[3.802px] border-[0.634px] border-[#5B6268] bg-[#F0F0F0] px-2 text-center text-[10px] text-[#666666] dark:bg-[#181a1b] dark:text-[#a8a299]">
                  No favorites yet
                </div>
              )}
            </ProfileCarouselSection>
          </div>

          <div className="flex w-full flex-col items-center">
            <SiteFooter className="w-full" />
          </div>
        </div>
      </div>

      {/* Desktop — Figma My Account @ node 901:6475 */}
      <div className="hidden min-h-screen bg-hw-bg md:block">
        <SiteHeader />
        <main className="mx-auto max-w-[1650px] px-4 py-8 lg:px-6 lg:py-10">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 text-center text-[39px] font-bold text-hw-account"
          >
            My Account
          </motion.h1>

          <DesktopProfileBanner user={profileUser} />

          <section className="mt-12">
            <ProfileSectionHeader
              title="Discover Just Uploaded"
              seeAllHref="/"
              titleClassName="font-semibold text-hw-account"
            />
            {justUploadedLoading ? (
              <LoadingBlock />
            ) : justUploaded.length === 0 ? (
              <p className="py-12 text-center text-sm text-hw-muted">
                No new wallpapers yet.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-1">
                {justUploaded.map((wallpaper, index) => (
                  <ProfileWallpaperThumb
                    key={wallpaper.id}
                    wallpaper={wallpaper}
                    index={index}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="mt-12">
            <ProfileSectionHeader
              title="Your Uploads"
              seeAllHref="/profile/uploads"
              titleClassName="font-semibold text-hw-account"
            />
            {uploadsLoading ? (
              <LoadingBlock />
            ) : (
              <div className="grid grid-cols-4 gap-1">
                <UploadPlaceholder className="max-w-none" />
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

          <section className="mt-12">
            <ProfileSectionHeader
              title="Your Favorites"
              seeAllHref="/profile/favorites"
              titleClassName="font-semibold text-hw-account"
            />
            {favoritesLoading ? (
              <LoadingBlock />
            ) : favorites.length === 0 ? (
              <p className="py-12 text-center text-sm text-hw-muted">
                No favorites yet.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-1">
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
