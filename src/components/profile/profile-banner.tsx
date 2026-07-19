"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import {
  AccountSettingsModal,
  profileUserToAccountSettings,
  type AccountSettingsData,
} from "@/components/profile/account-settings/account-settings-modal";
import type { ProfileUser } from "@/data/profile-user";
import { cn } from "@/lib/utils";
import { shouldUnoptimizeMedia } from "@/lib/media-url";

interface ProfileBannerProps {
  user: ProfileUser;
}

/** Figma Halal-Stock-Mobile-App — Profile and Carousel @ 412px (node 1612:5367) */
const GOLD = "#ffd700";

function formatBio(bio: string) {
  const trimmed = bio.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("“") || trimmed.startsWith('"')) return trimmed;
  return `“${trimmed}”`;
}

export function ProfileBanner({ user: initialUser }: ProfileBannerProps) {
  const { user: authUser, updateProfile, openAuthModal } = useAuth();
  const [user, setUser] = useState(initialUser);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountSettings, setAccountSettings] = useState<AccountSettingsData>(
    () => profileUserToAccountSettings(initialUser),
  );

  const favoritesCount =
    authUser?.favoritesCount ?? authUser?.favorites.length ?? user.favoritesCount;
  const uploadsCount = authUser?.uploadsCount ?? user.uploadsCount;

  async function handleAccountSave(data: AccountSettingsData) {
    await updateProfile({
      name: data.name,
      bio: data.description,
      avatar: data.avatar,
      banner: data.banner,
    });

    setAccountSettings(data);
    setUser((prev) => ({
      ...prev,
      name: data.name,
      bio: data.description,
      avatar: data.avatar,
      banner: data.banner,
    }));
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const bio = formatBio(user.bio);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden border-t-[1.437px] border-b-[0.6px] md:rounded-[28px] md:border-3 md:border-hw-yellow"
      style={{ borderColor: GOLD }}
    >
      <div className="relative h-[252px] w-full md:aspect-[16/5] md:min-h-[470px]">
        <Image
          src={user.banner}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 1400px"
        />

        {/* Figma: Full account container — 197.377 × 225.163 */}
        <div className="absolute inset-x-0 top-[13.414px] flex justify-center md:top-1/2 md:-translate-y-1/2">
          <div className="relative h-[225.163px] w-[197.377px] shrink-0 md:h-[320px] md:w-[280px]">
            {user.isPremium && (
              <div className="absolute left-[38.8px] top-0 z-10 md:left-1/2 md:-translate-x-1/2">
                <span
                  className="inline-flex items-center gap-[3.833px] rounded-[15.622px] border-[0.958px] bg-black/50 px-[9.581px] py-[5.749px] text-[9.581px] font-medium text-[#ffd700] md:gap-1.5 md:rounded-2xl md:px-3.5 md:py-1.5 md:text-xs"
                  style={{ borderColor: GOLD }}
                >
                  <Image
                    src="/profile-banner/premium-gem.svg"
                    alt=""
                    width={12}
                    height={10}
                    className="h-[9.901px] w-[11.498px] md:h-3 md:w-3.5"
                  />
                  Premium Member
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => openAuthModal("premium")}
              aria-label="Premium"
              className="absolute left-[-14.63px] top-[79.73px] z-10 size-9 md:-left-5 md:top-[110px] md:size-10"
            >
              <Image
                src="/profile-banner/premium-side.svg"
                alt=""
                width={36}
                height={36}
                className="size-full object-contain"
              />
            </button>

            <div
              className="absolute left-[40.72px] top-[33.85px] size-[114.977px] overflow-hidden rounded-full border-[1.437px] shadow-[0px_0px_5.749px_0px_rgba(255,215,0,0.6)] md:left-1/2 md:top-12 md:size-[160px] md:-translate-x-1/2 md:border-2"
              style={{ borderColor: GOLD }}
            >
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  unoptimized={shouldUnoptimizeMedia(user.avatar)}
                  className="object-cover"
                  sizes="115px"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-black/60 text-lg font-semibold text-white">
                  {initials}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="Edit profile"
              className="absolute left-[175px] top-[79.73px] z-10 size-9 md:left-[calc(50%+92px)] md:top-[110px] md:size-10"
            >
              <Image
                src="/profile-banner/edit.svg"
                alt=""
                width={36}
                height={36}
                className="size-full object-contain"
              />
            </button>

            <div className="absolute left-1/2 top-[161.59px] flex -translate-x-1/2 items-center gap-[14px] md:top-[220px] md:w-full md:max-w-none">
              <div className="w-[76.651px] rounded-[5.749px] bg-black/50 px-[7.665px] py-[5.749px] md:w-auto md:rounded-lg md:px-3 md:py-2">
                <p className="whitespace-nowrap text-[11.498px] font-light leading-normal text-white md:text-sm">
                  {favoritesCount} Favorites
                </p>
              </div>

              <div className="flex h-[63.237px] w-[197.377px] flex-col items-center justify-center rounded-[9.581px] bg-black/50 p-[9.581px] md:h-auto md:w-full md:max-w-[240px] md:rounded-2xl md:p-4">
                <p className="text-center text-[14.372px] font-semibold leading-normal text-white md:text-lg">
                  {user.name}
                </p>
                {bio ? (
                  <p className="mt-[10.54px] text-center text-[9.581px] leading-normal text-white/72 md:mt-2 md:text-sm">
                    {bio}
                  </p>
                ) : null}
                <p
                  className={cn(
                    "text-center text-[9.581px] leading-normal text-white/60 md:text-xs",
                    bio ? "mt-[10.54px] md:mt-1.5" : "mt-[10.54px] md:mt-2",
                  )}
                >
                  {user.email}
                </p>
              </div>

              <div className="rounded-[5.749px] bg-black/50 px-[7.665px] py-[5.749px] md:rounded-lg md:px-3 md:py-2">
                <p className="whitespace-nowrap text-[11.498px] font-light leading-normal text-white md:text-sm">
                  {uploadsCount} Uploads
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AccountSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        initialData={accountSettings}
        onSave={handleAccountSave}
      />
    </motion.div>
  );
}
