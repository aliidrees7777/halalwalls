"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { PremiumIcon } from "@/components/profile/premium-icon";
import {
  AccountSettingsModal,
  profileUserToAccountSettings,
  type AccountSettingsData,
} from "@/components/profile/account-settings/account-settings-modal";
import type { ProfileUser } from "@/data/profile-user";
import { shouldUnoptimizeMedia, upgradeAvatarUrl } from "@/lib/media-url";

interface DesktopProfileBannerProps {
  user: ProfileUser;
}

/**
 * Desktop profile banner — scaled from Figma mobile banner (1612:5749)
 * to the desktop My Account frame (1381:13265).
 *
 * Scale: 214 / 114.977 ≈ 1.861 (avatar size is the design anchor).
 */
const GOLD = "#ffd700";
const FREE_GREY = "#9ca3af";
const S = 214 / 114.977;

const D = {
  pad: 13.414 * S, // ≈ 25
  stageW: 197.377 * S, // ≈ 367
  stageH: 225.163 * S, // ≈ 419
  bannerH: 13.414 * S * 2 + 225.163 * S, // ≈ 469
  avatar: 214,
  avatarLeft: 40.72 * S, // ≈ 76
  avatarTop: 33.85 * S, // ≈ 63
  avatarBorder: 1.437 * S, // ≈ 2.7 → use 3
  avatarGlow: 5.749 * S, // ≈ 10.7
  badgeLeft: 38.8 * S, // ≈ 72
  badgeGap: 3.833 * S, // ≈ 7.1
  badgePx: 9.581 * S, // ≈ 17.8
  badgePy: 5.749 * S, // ≈ 10.7
  badgeRadius: 15.622 * S, // ≈ 29.1
  badgeFont: 9.581 * S, // ≈ 17.8
  badgeBorder: 0.958 * S, // ≈ 1.8
  gemW: 11.498 * S, // ≈ 21.4
  gemH: 9.901 * S, // ≈ 18.4
  sideBtn: 36 * S, // ≈ 67
  sideTop: 79.73 * S, // ≈ 148
  premiumLeft: -14.63 * S, // ≈ -27
  editLeft: 175 * S, // ≈ 326
  infosTop: 161.59 * S, // ≈ 301
  infosGap: 14 * S, // ≈ 26
  favW: 76.651 * S, // ≈ 143
  favPx: 7.665 * S, // ≈ 14.3
  favPy: 5.749 * S, // ≈ 10.7
  favRadius: 5.749 * S, // ≈ 10.7
  favFont: 11.498 * S, // ≈ 21.4
  infoW: 197.377 * S, // ≈ 367
  infoH: 63.237 * S, // ≈ 118
  infoP: 9.581 * S, // ≈ 17.8
  infoRadius: 9.581 * S, // ≈ 17.8
  infoTextGap: 10.54 * S, // ≈ 19.6
  nameFont: 14.372 * S, // ≈ 26.7
  metaFont: 9.581 * S, // ≈ 17.8
  exit: 28.744 * S, // ≈ 53.5
  exitInset: 13.41 * S, // ≈ 25
} as const;

function formatBio(bio: string) {
  const trimmed = bio.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("“") || trimmed.startsWith('"')) return trimmed;
  return `“${trimmed}”`;
}

export function DesktopProfileBanner({
  user: initialUser,
}: DesktopProfileBannerProps) {
  const { user: authUser, updateProfile, logout: signOut, openAuthModal } =
    useAuth();
  const [user, setUser] = useState(initialUser);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountSettings, setAccountSettings] = useState<AccountSettingsData>(
    () => profileUserToAccountSettings(initialUser),
  );

  const favoritesCount =
    authUser?.favoritesCount ??
    authUser?.favorites.length ??
    user.favoritesCount;
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
  const isPremium = authUser?.isPremium ?? user.isPremium;
  const accent = isPremium ? GOLD : FREE_GREY;
  const avatarSrc = upgradeAvatarUrl(user.avatar, 512);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden border-solid"
      style={{
        height: D.bannerH,
        borderRadius: 28,
        borderWidth: 3,
        borderColor: accent,
      }}
    >
      <Image
        src={user.banner}
        alt=""
        fill
        className="object-cover"
        priority
        sizes="(max-width: 1650px) 100vw, 1650px"
      />

      {/* Exit / logout — Figma top-right */}
        {/* <button
          type="button"
          onClick={signOut}
          aria-label="Sign out"
          className="absolute z-20"
          style={{
            top: D.exitInset,
            right: D.exitInset,
            width: D.exit,
            height: D.exit,
          }}
        >
          <Image
            src="/profile-banner/exit.svg"
            alt=""
            width={54}
            height={54}
            className="size-full object-contain"
          />
        </button> */}

      {/* Full account container — centered */}
      <div
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ width: D.stageW, height: D.stageH }}
      >
        <div
          className="absolute z-10"
          style={{ left: D.badgeLeft, top: 0 }}
        >
          <span
            className="inline-flex items-center font-medium"
            style={{
              gap: D.badgeGap,
              paddingInline: D.badgePx,
              paddingBlock: D.badgePy,
              borderRadius: D.badgeRadius,
              borderWidth: D.badgeBorder,
              borderStyle: "solid",
              borderColor: accent,
              color: accent,
              backgroundColor: "rgba(0,0,0,0.5)",
              fontSize: D.badgeFont,
            }}
          >
            {isPremium ? (
              <PremiumIcon
                size={Math.round(D.gemW)}
                className="shrink-0 object-contain"
              />
            ) : null}
            {isPremium ? "Premium Member" : "Free Member"}
          </span>
        </div>

        {/* Premium side button */}
        <button
          type="button"
          onClick={() => openAuthModal("premium")}
          aria-label="Premium"
          className="absolute z-10"
          style={{
            left: D.premiumLeft,
            top: D.sideTop,
            width: D.sideBtn,
            height: D.sideBtn,
          }}
        >
          <Image
            src="/profile-banner/premium-side.svg"
            alt=""
            width={67}
            height={67}
            className="size-full object-contain"
          />
        </button>

        {/* Avatar */}
        <div
          className="absolute overflow-hidden rounded-full border-solid"
          style={{
            left: D.avatarLeft,
            top: D.avatarTop,
            width: D.avatar,
            height: D.avatar,
            borderWidth: 3,
            borderColor: accent,
            boxShadow: isPremium
              ? `0 0 ${D.avatarGlow}px rgba(255,215,0,0.6)`
              : `0 0 ${D.avatarGlow}px rgba(156,163,175,0.45)`,
          }}
        >
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={user.name}
              fill
              unoptimized={shouldUnoptimizeMedia(avatarSrc)}
              quality={95}
              className="object-cover"
              sizes="428px"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-black/60 text-2xl font-semibold text-white">
              {initials}
            </div>
          )}
        </div>

        {/* Edit / settings */}
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Edit profile"
          className="absolute z-10"
          style={{
            left: D.editLeft,
            top: D.sideTop,
            width: D.sideBtn,
            height: D.sideBtn,
          }}
        >
          <Image
            src="/profile-banner/edit.svg"
            alt=""
            width={67}
            height={67}
            className="size-full object-contain"
          />
        </button>

        {/* Owner infos — favorites | card | uploads */}
        <div
          className="absolute left-1/2 flex -translate-x-1/2 items-center"
          style={{ top: D.infosTop, gap: D.infosGap }}
        >
          <div
            className="shrink-0 bg-black/50"
            style={{
              width: D.favW,
              paddingInline: D.favPx,
              paddingBlock: D.favPy,
              borderRadius: D.favRadius,
            }}
          >
            <p
              className="whitespace-nowrap font-light leading-normal text-white"
              style={{ fontSize: D.favFont }}
            >
              {favoritesCount} Favorites
            </p>
          </div>

          {/* Owner Info — Figma Owner Info card (name / bio / email) */}
          <div
            className="primary-font relative flex shrink-0 flex-col items-center justify-center overflow-clip bg-[rgba(0,0,0,0.5)]"
            style={{
              width: D.infoW,
              minHeight: D.infoH,
              padding: D.infoP,
              borderRadius: D.infoRadius,
            }}
          >
            <div
              className="flex w-full flex-col items-center justify-center whitespace-nowrap"
              style={{ gap: D.infoTextGap }}
            >
              <p
                className="font-semibold leading-none text-white [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]"
                style={{ fontSize: D.nameFont }}
              >
                {user.name}
              </p>
              {bio ? (
                <p
                  className="font-normal leading-none text-[rgba(255,255,255,0.72)] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]"
                  style={{ fontSize: D.metaFont }}
                >
                  {bio}
                </p>
              ) : null}
              <p
                className="font-normal leading-none text-[rgba(255,255,255,0.6)] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]"
                style={{ fontSize: D.metaFont }}
              >
                {user.email}
              </p>
            </div>
          </div>

          <div
            className="shrink-0 bg-black/50"
            style={{
              paddingInline: D.favPx,
              paddingBlock: D.favPy,
              borderRadius: D.favRadius,
            }}
          >
            <p
              className="whitespace-nowrap font-light leading-normal text-white"
              style={{ fontSize: D.favFont }}
            >
              {uploadsCount} Uploads
            </p>
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
