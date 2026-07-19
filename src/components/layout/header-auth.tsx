"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { shouldUnoptimizeMedia, upgradeAvatarUrl } from "@/lib/media-url";

/**
 * Header auth control: shows "Sign In" for guests, or the user's avatar
 * (links to /profile) + a log-out button when signed in.
 */
export function HeaderAuth({ className }: { className?: string }) {
  const { user, isAuthenticated, logout, loading ,openAuthModal} = useAuth();

  // Avoid a flash of "Sign In" before the session hydrates.
  if (loading) {
    return <div className={cn("h-[40.89px] w-[90.44px]", className)} aria-hidden />;
  }

  if (!isAuthenticated || !user) {
    return (
      <button
        type="button"
        onClick={() => openAuthModal("signin")}
        className={cn(
          "inline-flex h-[40.89px] w-[90.44px] shrink-0 items-center justify-center rounded-[9.24px] bg-black text-[14px] font-medium text-white/90 transition-colors hover:bg-black/90",
          className,
        )}
      >
        Sign In
      </button>
    );
  }

  const initial = (user.firstName || user.name || user.email || "?").charAt(0).toUpperCase();
  const avatarSrc = upgradeAvatarUrl(user.avatar, 128);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link
        href="/profile"
        aria-label="Your profile"
        title={user.name || user.email}
        className="grid size-9 place-items-center overflow-hidden rounded-full border border-hw-border bg-hw-pill2 text-sm font-semibold text-hw-foreground transition-colors hover:border-hw-green"
      >
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt=""
            width={36}
            height={36}
            unoptimized={shouldUnoptimizeMedia(avatarSrc)}
            className="size-full object-cover"
          />
        ) : (
          initial
        )}
      </Link>
      <button
        type="button"
        onClick={logout}
        aria-label="Log out"
        title="Log out"
        className="grid size-9 place-items-center rounded-full border border-hw-border text-hw-muted transition-colors hover:border-hw-muted hover:text-hw-foreground"
      >
        <LogOut className="size-[17px]" />
      </button>
    </div>
  );
}
