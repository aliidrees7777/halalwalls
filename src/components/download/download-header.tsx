"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/shared/search-box";
import { HalalWallsLogo } from "@/components/home/halalwalls-logo";
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

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-lg border border-white/25 px-3.5 py-1.5 text-[13px] font-medium text-hw-foreground transition-colors hover:bg-white/5 sm:inline-block"
          >
            Sign In
          </Link>
          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-hw-border text-hw-foreground transition-colors hover:border-hw-muted"
            aria-label="Toggle dark mode"
          >
            <Moon className="size-[18px]" />
          </button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-hw-muted hover:text-hw-foreground lg:hidden"
                />
              }
            >
              <Menu className="size-5" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] border-hw-border bg-hw-card"
            >
              <SheetHeader>
                <SheetTitle className="text-hw-foreground">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 md:hidden">
                <SearchBox
                  value={search}
                  onChange={setSearch}
                  onSubmit={(q) => {
                    setOpen(false);
                    handleSearch(q);
                  }}
                />
              </div>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <div key={item.label} className="py-2">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-hw-muted">
                      {item.label}
                    </p>
                    {item.items.map((sub) => (
                      <Link
                        key={sub}
                        href="/"
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-hw-muted hover:bg-hw-surface hover:text-hw-foreground"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                ))}
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex justify-center rounded-lg border border-white/25 px-4 py-2 text-sm text-hw-foreground"
                >
                  Sign In
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="h-px w-full bg-hw-green" aria-hidden />

      <div className="border-b border-[#1a1f1d] px-4 py-2.5 md:hidden">
        <div className="mx-auto max-w-[520px]">
          <SearchBox value={search} onChange={setSearch} onSubmit={handleSearch} />
        </div>
      </div>
    </header>
  );
}
