"use client";

import { Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { HalalWallsLogo } from "@/components/home/halalwalls-logo";
import { MobileFilterMenu } from "@/components/home/mobile-filter-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { HeaderAuth } from "@/components/layout/header-auth";
import { HeaderNav } from "@/components/layout/header-nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-hw-header">
      <div className="mx-auto flex h-[70px] max-w-[1650px] items-center gap-4 px-4 lg:px-6">
        {/* {dark ? ():()} */}
        <HalalWallsLogo className="shrink-0" />

        

        {/* Right cluster — pushed fully right via ml-auto */}
        <div className="ml-auto flex items-center gap-5">
          <Suspense fallback={null}>
            <HeaderNav className="mx-auto" />
          </Suspense>
          <HeaderAuth className="hidden sm:flex" />
          <ThemeToggle className="hidden size-9 lg:flex" />

          {/* Burger — far right, opens the top-to-bottom menu */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
            className="flex h-9 w-11 items-center justify-center rounded-md border border-hw-border text-hw-muted transition-colors hover:text-hw-foreground lg:hidden"
          >
            {open ? <X className="size-[26px]" /> : <Menu className="size-[26px]" />}
          </button>
        </div>
      </div>

      <div className="border-3 border-hw-green" aria-hidden />

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
              <Suspense fallback={null}>
                <MobileFilterMenu onNavigate={() => setOpen(false)} />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
