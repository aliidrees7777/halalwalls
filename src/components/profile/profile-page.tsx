"use client";

import { motion } from "framer-motion";
import { ProfileHeaderNav } from "@/components/profile/profile-header-nav";
import { ProfileBanner } from "@/components/profile/profile-banner";
import { ProfileSectionHeader } from "@/components/profile/profile-section-header";
import { ProfileWallpaperThumb } from "@/components/profile/profile-wallpaper-thumb";
import { UploadPlaceholder } from "@/components/profile/upload-placeholder";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileProfile } from "@/components/profile/mobile-profile";
import {
  demoProfileUser,
  discoverJustUploaded,
  profileFavorites,
} from "@/data/profile-user";

export function ProfilePage() {
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

        <ProfileBanner user={demoProfileUser} />

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
          <UploadPlaceholder />
        </section>

        <section className="mt-10 sm:mt-12">
          <ProfileSectionHeader title="Your Favorites" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {profileFavorites.map((wallpaper, index) => (
              <ProfileWallpaperThumb
                key={wallpaper.id}
                wallpaper={wallpaper}
                index={index}
              />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
      </div>
    </>
  );
}
