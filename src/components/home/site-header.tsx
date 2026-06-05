"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Clock, Menu } from "lucide-react";
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-hw-header">
      <div className="mx-auto grid h-[52px] max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 lg:px-6">
        <HalalWallsLogo className="justify-self-start" />

        <nav
          className="hidden items-center gap-0.5 justify-self-center lg:flex"
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
            href="#"
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

        <div className="flex items-center justify-end gap-2.5 justify-self-end">
          <Link
            href="/profile"
            className="hidden rounded-lg border border-white/25 px-4 py-1.5 text-[13px] font-medium text-hw-foreground transition-colors hover:bg-white/5 sm:inline-block"
          >
            Sign In
          </Link>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full border border-hw-border text-hw-foreground transition-colors hover:border-hw-muted"
            aria-label="View history"
          >
            <Clock className="size-[18px]" />
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
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <div key={item.label} className="py-2">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-hw-muted">
                      {item.label}
                    </p>
                    {item.items.map((sub) => (
                      <Link
                        key={sub}
                        href="#"
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-hw-muted hover:bg-hw-surface hover:text-hw-foreground"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                ))}
                <Link
                  href="#"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-hw-muted hover:text-hw-foreground"
                >
                  Upload
                </Link>
                <Link
                  href="/premium"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-hw-yellow"
                >
                  Premium
                </Link>
                <Link
                  href="/profile"
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
    </header>
  );
}
