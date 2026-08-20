"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/auth-context";

export function HalalWallsLogo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const { authModal, closeAuthModal } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isLight = resolvedTheme === "light";

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5", className)}
      onClick={() => {
        // Mobile subscription shell: same-route "/" does not change pathname,
        // so close premium explicitly. AuthModal SiteHeader is md:hidden.
        if (authModal.open && authModal.view === "premium") {
          closeAuthModal();
        }
      }}
    >
      <Image
        src={isLight ? "/logolisgt.svg" : "/logo.svg"}
        alt="Logo"
        width={185}
        height={36}
        className="h-[34px] w-[175px] shrink-0 pl-[9px] md:h-9 md:w-[185px]"
        priority
      />
    </Link>
  );
}
