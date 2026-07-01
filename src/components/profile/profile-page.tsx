"use client";

import { useEffect, useState } from "react";
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
import type { ProfileUser } from "@/data/profile-user";
import { api } from "@/lib/api";
import type { Wallpaper } from "@/types/wallpaper";
import { SiteHeader } from "../home/site-header";

export function ProfilePage() {
  const router = useRouter();
  const { user, loading, openAuthModal } = useAuth();
  const { wallpapers: favorites, loading: favoritesLoading } = useMyFavorites();
  const { wallpapers: uploads } = useMyUploads();

  // "Discover Just Uploaded" — latest live wallpapers from the catalog.
  const [discover, setDiscover] = useState<Wallpaper[]>([]);
  useEffect(() => {
    let ignore = false;
    api
      .get<{ wallpapers: Wallpaper[] }>("/wallpapers?sort=latest&limit=8")
      .then((d) => {
        if (!ignore) setDiscover(d.wallpapers);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  // Auth guard: the profile is private — prompt sign-in when not logged in.
  useEffect(() => {
    if (!loading && !user) {
      openAuthModal("full-signin");
    }
  }, [loading, user, openAuthModal]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center ">
        <div className="size-8 animate-spin rounded-full border-2 border-hw-muted border-t-hw-foreground" />
      </div>
    );
  }

  // Not signed in → render nothing (the sign-in modal is opened by the effect above).
  if (!user) return null;

  // Only the user's REAL data — no demo avatar/banner. When unset, the banner
  // shows a branded gradient and the avatar shows the user's initials.
  const profileUser: ProfileUser = {
    id: user.id,
    name: user.name || user.email,
    bio: user.bio || "",
    email: user.email,
    avatar: user.avatar || "",
    banner: user.banner || "",
    isPremium: user.isPremium,
    favoritesCount: user.favoritesCount,
    uploadsCount: user.uploadsCount ?? 0,
  };

  return (
    <>
      {/* Mobile: immersive app-style profile (matches Figma) */}
      {/* <div className="md:hidden">
        <MobileProfile />
      </div> */}

      {/* Desktop / tablet */}
      <div className=" min-h-screen bg-hw-bg md:block">
<SiteHeader/>
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

        <section className="">
          <div className="flex items-end justify-between mb-10">
          <h1 className="lg:text-4xl text-2xl font-semibold  text-hw-account">Discover Just Uploaded</h1>
           <ProfileSectionHeader title="" className="text-right"/>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-2 lg:grid-cols-4">
            {discover.map((wallpaper, index) => (
              <ProfileWallpaperThumb
                key={wallpaper.id}
                wallpaper={wallpaper}
                index={index}
              />
            ))}
          </div>
        </section>

        <section className="">
           <div className="flex items-end justify-between my-10">
          <h2 className="lg:text-4xl text-2xl font-semibold text-hw-account">Your Uploads</h2>
          <ProfileSectionHeader title="" seeAllHref={null} />
          </div>
          {uploads.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-2 lg:grid-cols-4 max-w-4xl">
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

        <section className="">
           <div className="flex items-end justify-between mb-10">
          <h2 className="lg:text-4xl text-2xl font-semibold  text-hw-account">Your Favorites</h2>
          <ProfileSectionHeader title="" />
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
        </section>
      </main>

      <SiteFooter />
      </div>
    </>
  );
}