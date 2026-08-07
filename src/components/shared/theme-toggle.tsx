"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

/**
 * Round icon button that flips between dark and light themes.
 * Icons are fixed at 36×36 (same as the previous sun/moon assets).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { isLight, setTheme } = useAuth();

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center",
        className,
      )}
    >
      {isLight ? (
        <Image
          src="/Light-mode-icon.svg"
          alt=""
          width={36}
          height={36}
          className="size-9"
          priority
        />
      ) : (
        <Image
          src="/Night-mode-icon.svg"
          alt=""
          width={36}
          height={36}
          className="size-9"
          priority
        />
      )}
    </button>
  );
}
