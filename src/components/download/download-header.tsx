"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchBox } from "@/components/shared/search-box";
import { HalalWallsLogo } from "@/components/home/halalwalls-logo";
import { MobileFilterMenu } from "@/components/home/mobile-filter-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { HeaderAuth } from "@/components/layout/header-auth";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Explore",
    items: [
      { label: "Latest", href: "/?category=latest" },
      { label: "Most Popular", href: "/?category=popular" },
      { label: "Random Picks", href: "/?category=random" },
      { label: "Live Wallpapers", href: "/?category=live" },
    ],
  },
  {
    label: "Categories",
    items: [
      { label: "Islamic", href: "/?category=islamic" },
      { label: "Anime", href: "/?category=anime" },
      { label: "Gaming", href: "/?category=gaming" },
      { label: "Superheroes", href: "/?category=superheroes" },
      { label: "Cars", href: "/?category=cars" },
      { label: "Space", href: "/?category=space" },
    ],
  },
  {
    label: "Resolutions",
    items: [
      { label: "1920×1080", href: "/?category=latest" },
      { label: "2560×1440", href: "/?category=latest" },
      { label: "4K UHD", href: "/?category=latest" },
      { label: "Mobile HD", href: "/?category=latest" },
    ],
  },
];

export function DownloadHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (q: string) => {
    if (q.trim()) router.push(`/?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-hw-header">
      <div className="mx-auto flex h-[52px] max-w-[1400px] items-center gap-3 px-4 lg:gap-4 lg:px-6">
        <HalalWallsLogo className="shrink-0" />

        <div className="hidden min-w-0 flex-1 md:block lg:max-w-[420px] lg:justify-self-center xl:max-w-[520px]">
          <SearchBox value={search} onChange={setSearch} onSubmit={handleSearch} />
        </div>

        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <DropdownMenu key={item.label}>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-0.5 rounded-md px-2.5 py-2 text-[13px] text-hw-muted xl:px-3",
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
                    key={sub.label}
                    render={<Link href={sub.href} />}
                    className="text-sm text-hw-muted focus:bg-hw-surface focus:text-hw-foreground"
                  >
                    {sub.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          <Link
            href="/upload"
            className="rounded-md px-2.5 py-2 text-[13px] text-hw-muted transition-colors hover:text-hw-foreground xl:px-3"
          >
            Upload
          </Link>
          <Link
            href="/premium"
            className="rounded-md px-2.5 py-2 text-[13px] font-medium text-hw-yellow transition-opacity hover:opacity-90 xl:px-3"
          >
            Premium
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <HeaderAuth className="hidden sm:flex" />
          <ThemeToggle className="hidden size-9 shrink-0 lg:flex" />

          {/* Burger — far right, opens the top-to-bottom menu (mobile) */}
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
