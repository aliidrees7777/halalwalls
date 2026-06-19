"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import mon from "../../../public/mon.svg";
import sun from "../../../public/sun.svg"
import { useAuth } from "@/context/auth-context";
/**
 * Round icon button that flips between dark and light themes (next-themes).
 * Shows a Sun in light mode and a Moon in dark mode. Guards on `mounted`
 * to avoid a hydration mismatch (the icon depends on the resolved theme).
 */
export function ThemeToggle({ className }: { className?: string }) {
const {isLight,setTheme}= useAuth()
  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      // className={cn(
      //   "items-center justify-center rounded-full border border-hw-border text-hw-foreground transition-colors hover:border-hw-muted",
      //   className
      // )}
    >
      {isLight ? <Image src={sun} alt="Moon icon" className="hidden md:flex"/> : <Image src={mon} alt="Moon icon" className="hidden md:flex"/>}
    </button>
  );
}
