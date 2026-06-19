"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

/**
 * Header auth control: shows "Sign In" for guests, or the user's avatar
 * (links to /profile) + a log-out button when signed in.
 */
export function HeaderAuth({ className }: { className?: string }) {
  const { user, isAuthenticated, logout, loading ,openAuthModal} = useAuth();

  // Avoid a flash of "Sign In" before the session hydrates.
  if (loading) {
    return <div className={cn("h-9 w-[84px]", className)} aria-hidden />;
  }

  if (!isAuthenticated || !user) {
    return (
<button
  onClick={() => openAuthModal("signin")} // "signin" view ke liye
  className={cn(
    "rounded-[10px] px-6 py-4 text-[18px] font-medium text-white transition-colors bg-hw-surface",
  )}
>
  Sign In
</button>
    );
  }

  const initial = (user.firstName || user.name || user.email || "?").charAt(0).toUpperCase();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link
        href="/profile"
        aria-label="Your profile"
        title={user.name || user.email}
        className="grid size-9 place-items-center overflow-hidden rounded-full border border-hw-border bg-hw-pill2 text-sm font-semibold text-hw-foreground transition-colors hover:border-hw-green"
      >
        {user.avatar ? (
          <Image src={user.avatar} alt="" width={36} height={36} className="size-full object-cover" />
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
