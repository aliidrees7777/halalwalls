"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Info, Heart, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { demoProfileUser } from "@/data/profile-user";
import { useAuth } from "@/context/auth-context";
import { useMyFavorites } from "@/hooks/use-my-favorites";
import type { Wallpaper } from "@/types/wallpaper";
import settings from "../../../public/my-account/settings.png";

/**
 * Mobile profile screen — matches the Figma mobile design:
 * immersive full-bleed banner at the very top (no site header/search),
 * green stats pill, and a masonry grid of price cards. Shown only on mobile.
 */
type GridItem = Wallpaper & { price: number | null; aspect: string };

// Cosmetic decorations cycled across the live favorites so the masonry grid
// keeps its varied heights / pricing badges (data is real, styling is static).
const ASPECTS = [
  "aspect-[3/4]",
  "aspect-[16/10]",
  "aspect-[16/11]",
  "aspect-[16/9]",
  "aspect-[4/3]",
];

function PriceCard({ item }: { item: GridItem }) {
  const [fav, setFav] = useState(item.isFavorite ?? false);
  const free = item.price == null;

  return (
    <div className="relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-hw-card">
      <Link href={`/wallpaper/${item.slug}`} className="block">
        <div className={cn("relative w-full", item.aspect)}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 200px"
          />
        </div>
      </Link>

      {/* info */}
      <span className="absolute left-2 top-2 grid size-6 place-items-center rounded-full bg-black/35 text-white/80">
        <Info className="size-3.5" />
      </span>

      {/* favorite */}
      <button
        type="button"
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        onClick={() => setFav((v) => !v)}
        className="absolute right-2 top-2"
      >
        <Heart
          className={cn(
            "size-6 drop-shadow",
            fav ? "fill-red-500 text-red-500" : "fill-black/40 text-white/90"
          )}
        />
      </button>

      {/* price / free badge */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex h-9 items-center px-3 text-black",
          free ? "justify-between bg-[#05DF8B]" : "justify-between bg-[#FFD700]"
        )}
        style={{
          boxShadow: free
            ? "0 0 6px rgba(5,223,139,0.6)"
            : "0 0 6px rgba(255,215,0,0.6)",
        }}
      >
        {free ? (
          <>
            <span className="text-base font-bold">Free</span>
            <Download className="size-5" />
          </>
        ) : (
          <>
            <Download className="size-5" />
            <span className="text-base font-bold">${item.price}</span>
            <span className="grid place-items-center">
              <ShoppingCart className="size-5" />
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export function MobileProfile() {
  const router = useRouter();
  const { user: authUser, loading,openAuthModal ,} = useAuth();
  const { wallpapers: favorites, loading: favoritesLoading } = useMyFavorites();

  // useEffect(() => {
  //   if (!loading && !user) {
  //     openAuthModal("full-signin");
  //   }
  // }, [loading, openAuthModal]);

  const gridItems: GridItem[] = favorites.map((w, i) => ({
    ...w,
    price: null,
    aspect: ASPECTS[i % ASPECTS.length],
  }));

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-hw-bg">
        <div className="size-8 animate-spin rounded-full border-2 border-hw-muted border-t-hw-foreground" />
      </div>
    );
  }

  if (!authUser) return null;

  const user = {
    name: authUser.name || authUser.email,
    email: authUser.email,
    avatar: authUser.avatar || demoProfileUser.avatar,
    banner: authUser.banner || demoProfileUser.banner,
    isPremium: authUser.isPremium,
    favoritesCount: authUser.favoritesCount,
    uploadsCount: authUser.uploadsCount ?? 0,
  };

  return (
    <div className="min-h-dvh bg-hw-bg">
      {/* Immersive banner */}
      <header className="relative">
        <div className="relative h-[210px] w-full overflow-hidden rounded-b-[20px]">
          <Image src={user.banner} alt="" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/45" />
        </div>

        {/* location chip + gear / avatar / cart */}
        <div className="absolute inset-x-0 top-4 flex flex-col items-center">
          <span className="rounded-full bg-black/35 px-2.5 py-0.5 text-[10px] font-light text-white/70">
            UAE, Dubai
          </span>
          <div className="mt-2 flex items-center gap-5">
            <button
              type="button"
              aria-label="Settings"
              className="grid size-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55"
            >
              <Image
                src={settings}
                alt=""
                width={18}
                height={18}
                className="size-[18px]"
              />
            </button>

            <div
              className="relative size-24 shrink-0 overflow-hidden rounded-full border-[3px] border-white/80"
              style={{ boxShadow: "0 0 14px rgba(215,0,185,0.65)" }}
            >
              <Image src={user.avatar} alt={user.name} fill className="object-cover" sizes="96px" />
            </div>

            <button
              type="button"
              aria-label="Cart"
              className="grid size-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55"
            >
              <ShoppingCart className="size-[18px]" />
            </button>
          </div>
        </div>

        {/* name card */}
        <div className="relative z-10 mx-auto -mt-10 w-[88%] max-w-[340px] rounded-2xl bg-black/45 px-4 py-3 text-center backdrop-blur-sm">
          <h1 className="text-lg font-bold text-white">{user.name}</h1>
          <p className="mt-0.5 text-xs text-white/70">&ldquo;A Pro level Photographer&rdquo;</p>
          <p className="mt-0.5 text-xs text-white/50">{user.email}</p>
        </div>
      </header>

      {/* Stats pill */}
      <div
        className="mx-4 mt-4 grid grid-cols-3 rounded-[20px] bg-[#05DF8B] py-3 text-center text-black"
        style={{ boxShadow: "0 0 8px rgba(5,223,139,0.5)" }}
      >
        {[
          { label: "Images", value: String(user.uploadsCount) },
          { label: "Followers", value: "1000" },
          { label: "Following", value: "15" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-xs font-light">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Masonry grid */}
      {gridItems.length === 0 && !favoritesLoading ? (
        <p className="px-4 py-10 text-center text-xs text-hw-muted">
          No favorites yet.
        </p>
      ) : (
        <div className="columns-2 gap-3 px-4 pb-6 pt-5">
          {gridItems.map((item) => (
            <PriceCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
