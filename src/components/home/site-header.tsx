"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HalalWallsLogo } from "@/components/home/halalwalls-logo";
import { MobileFilterMenu } from "@/components/home/mobile-filter-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Explore",
    items: ["Latest Wallpapers", "Top Rated", "Editor's Picks", "New Uploads"],
  },
  {
    label: "Categories",
    items: ["Islamic", "Anime", "Gaming", "Superheroes", "Cars", "Space"],
  },
  {
    label: "Resolutions",
    items: ["1920×1080", "2560×1440", "4K UHD", "Mobile HD"],
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-hw-header">
      <div className="mx-auto flex h-[52px] max-w-[1400px] items-center gap-4 px-4 lg:px-6">
        <HalalWallsLogo className="shrink-0" />

        <nav
          className="mx-auto hidden items-center gap-0.5 lg:flex"
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <DropdownMenu key={item.label}>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-0.5 rounded-md px-3 py-2 text-[13px] text-hw-muted",
                  "transition-colors hover:text-hw-foreground"
                )}
              >
                {item.label}
                <ChevronDown className="size-3.5 opacity-80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-[180px] border-hw-border bg-hw-card"
              >
                {item.items.map((sub) => (
                  <DropdownMenuItem
                    key={sub}
                    className="text-sm text-hw-muted focus:bg-hw-surface focus:text-hw-foreground"
                  >
                    {sub}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          <Link
            href="/upload"
            className="rounded-md px-3 py-2 text-[13px] text-hw-muted transition-colors hover:text-hw-foreground"
          >
            Upload
          </Link>
          <Link
            href="/premium"
            className="rounded-md px-3 py-2 text-[13px] font-medium text-hw-yellow transition-opacity hover:opacity-90"
          >
            Premium
          </Link>
        </nav>

        {/* Right cluster — pushed fully right via ml-auto */}
        <div className="ml-auto flex items-center gap-2.5">
          <Link
            href="/login"
            className="hidden rounded-lg border border-white/25 px-4 py-1.5 text-[13px] font-medium text-hw-foreground transition-colors hover:bg-white/5 sm:inline-block"
          >
            Sign In
          </Link>
          <ThemeToggle className="hidden size-9 lg:flex" />

          {/* Burger — far right, opens the top-to-bottom menu */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
            className="flex size-9 items-center justify-center rounded-md border border-hw-border text-hw-muted transition-colors hover:text-hw-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-hw-green" aria-hidden />

      {/* Top-to-bottom expanding Filters menu (mobile only) */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-hw-card lg:hidden"
          >
            <div className="max-h-[calc(100dvh-53px)] overflow-y-auto px-4 pt-5 pb-28">
              <MobileFilterMenu onNavigate={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
