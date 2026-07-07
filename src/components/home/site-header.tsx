"use client";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { HalalWallsLogo } from "@/components/home/halalwalls-logo";
import { MobileFilterMenu } from "@/components/home/mobile-filter-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { HeaderAuth } from "@/components/layout/header-auth";
import { HeaderNav } from "@/components/layout/header-nav";
import { useAuth } from "@/context/auth-context";
import { SearchBox } from "@/components/shared/search-box";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function SiteHeader() {
  const router = useRouter();
  const { open, setOpen } = useAuth();
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const showSearchInput = pathname !== "/";
  const handleSearch = (q: string) => {
    if (q.trim()) router.push(`/?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-hw-bg">
      <div className="px-[var(--lp-header-inset-x)] pt-[var(--lp-header-inset-top)]">
        <div className="overflow-hidden rounded-[var(--lp-header-radius)] border-b-[length:var(--lp-header-accent)] border-hw-green bg-hw-header">
          <div className="lp-container flex h-[var(--lp-header-h)] items-center gap-4">
            {/* {dark ? ():()} */}
            <HalalWallsLogo className="shrink-0" />

        {pathname !== "/" && ( 
          <div className=" ml-25 hidden  flex-1 md:block lg:max-w-[337px] ">
            <SearchBox
              value={search}
              onChange={setSearch}
              onSubmit={handleSearch}
            />
          </div>
        )}

        {/* Right cluster — pushed fully right via ml-auto */}
        <div className="ml-auto flex items-center lg:gap-5 gap-3">
          <Suspense fallback={null}>
            <HeaderNav className="mx-auto" />
          </Suspense>
          {/* {pathname === "/profile" ? (
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
                className={cn(
                  "rounded-[10px] px-6 py-4 text-[18px] font-medium text-white transition-colors bg-hw-surface",
                )}
            >
              Dashboard
            </Link>
          ) : ( */}
            <HeaderAuth className="hidden sm:flex" />
          {/* )} */}

          <ThemeToggle className="hidden size-9 lg:flex" />

          {/* Burger — far right, opens the top-to-bottom menu */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
            className="flex h-9 w-11 items-center justify-center rounded-md border border-hw-border text-hw-muted transition-colors hover:text-hw-foreground lg:hidden"
          >
            {open ? (
              <X className="size-[26px]" />
            ) : (
              <Menu className="size-[26px]" />
            )}
          </button>
            </div>
          </div>
        </div>
      </div>

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
