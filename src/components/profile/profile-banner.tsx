"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PremiumWhiteIcon } from "@/components/profile/premium-white-icon";
import { PremiumIcon } from "@/components/profile/premium-icon";
import {
  AccountSettingsModal,
  profileUserToAccountSettings,
  type AccountSettingsData,
} from "@/components/profile/account-settings/account-settings-modal";
import { ProfileSideIconButton } from "@/components/profile/profile-side-icon-button";
import { ProfileStatPill } from "@/components/profile/profile-stat-pill";
import type { ProfileUser } from "@/data/profile-user";
import logout from "../../../public/my-account/logout.svg"
interface ProfileBannerProps {
  user: ProfileUser;
}

export function ProfileBanner({ user: initialUser }: ProfileBannerProps) {
  const { user: authUser, updateProfile } = useAuth();
  const [user, setUser] = useState(initialUser);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountSettings, setAccountSettings] = useState<AccountSettingsData>(
    () => profileUserToAccountSettings(initialUser)
  );

  const favoritesCount =
    authUser?.favoritesCount ?? authUser?.favorites.length ?? user.favoritesCount;
  const uploadsCount = authUser?.uploadsCount ?? user.uploadsCount;

  async function handleAccountSave(data: AccountSettingsData) {
    // Persist to the backend (PATCH /me). Email is intentionally not sent — the
    // backend ignores it and it isn't editable here. Errors propagate so the
    // modal can surface them instead of silently "succeeding".
    await updateProfile({
      name: data.name,
      bio: data.description,
      avatar: data.avatar,
      banner: data.banner,
    });

    // Reflect the changes locally only after the save actually succeeded.
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] border-3 border-hw-yellow "
    >
      <div className="relative aspect-[16/5] min-h-[600px] w-full sm:min-h-[280px] md:min-h-[470px]">
        <Image
          src={user.banner}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1400px) 100vw, 1400px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
      </div>

      {user.isPremium && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 sm:top-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hw-yellow/80 bg-black/50 px-3.5 py-1 text-[17px] font-medium text-hw-yellow backdrop-blur-sm sm:text-xs">
            <PremiumIcon size={14} className="sm:size-4" />
            Premium Member
          </span>
        </div>
      )}

      <button
        type="button"
        className="absolute right-4 top-4 z-10 flex w-12 h-12 items-center justify-center rounded-full bg-black/40 text-hw-foreground backdrop-blur-sm transition-colors hover:bg-black/60 sm:right-5 sm:top-5"
        aria-label="Sign out"
      >
        {/* <LogOut className="size-[18px]" /> */}
        <Image src={logout} alt="logout"/>
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-4 pb-5 pt-14 sm:pb-6 sm:pt-14">
        {/* Avatar row with flanking icon buttons */}
        <div className="mb-3 flex items-center justify-center gap-4 sm:gap-5">
          <ProfileSideIconButton
            label="Premium"
            iconNode={<PremiumWhiteIcon size={20} className="sm:size-[22px]" />}
          />

          <div className="relative">
            <div
              className="absolute -inset-1 rounded-full "
              aria-hidden
            />
            <Avatar className="relative w-[214px] h-[214px] after:hidden mb-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-hw-surface text-lg text-hw-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <ProfileSideIconButton
            icon={Settings}
            label="Settings"
            onClick={() => setSettingsOpen(true)}
          />
        </div>

        <AccountSettingsModal
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          initialData={accountSettings}
          onSave={handleAccountSave}
        />

        {/* User info card with stat pills flanking */}
        <div className="flex w-full max-w-xl items-end justify-center gap-3 sm:max-w-2xl sm:gap-4">
          <ProfileStatPill
            label={`${favoritesCount} Favorites`}
            className="hidden shrink-0 sm:inline-flex"
          />

          <div className="w-full max-w-sm rounded-[17px] border border-white/10 bg-black/50 px-5 py-3.5 text-center  sm:max-w-md sm:px-6 sm:py-4">
            <h1 className="text-[26px] font-bold text-[#ffffff] sm:text-lg">
              {user.name}
            </h1>
            <p className="mt-1 text-[17px] text-[#ffffff] sm:text-[13px]">
              {user.bio}
            </p>
            <p className="mt-1 text-[17px] text-[#ffffff] sm:text-[12px]">
              {user.email}
            </p>
          </div>

          <ProfileStatPill
            label={`${uploadsCount} Uploads`}
            className="hidden shrink-0 sm:inline-flex"
          />
        </div>

        {/* Mobile stat pills below info card */}
        <div className="mt-3 flex items-center justify-center gap-3 sm:hidden">
          <ProfileStatPill label={`${favoritesCount} Favorites`} />
          <ProfileStatPill label={`${uploadsCount} Uploads`} />
        </div>
      </div>
    </motion.div>
  );
}
