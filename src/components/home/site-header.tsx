"use client";

import Image from "next/image";
import Link from "next/link";
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
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { shouldUnoptimizeMedia, upgradeAvatarUrl } from "@/lib/media-url";

function MobileHeaderActions({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const { isAuthenticated, user, openAuthModal } = useAuth();

  return (
    <div className="flex items-center gap-3">
      {isAuthenticated && user ? (
        <Link
          href="/profile"
          aria-label="Your profile"
          className="flex h-7 w-[35px] items-center justify-center"
        >
          {user.avatar ? (
            <Image
              src={upgradeAvatarUrl(user.avatar, 96)}
              alt=""
              width={28}
              height={28}
              unoptimized={shouldUnoptimizeMedia(upgradeAvatarUrl(user.avatar, 96))}
              className="size-7 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-7 place-items-center rounded-full bg-[#303133] text-[11px] font-semibold text-[#ccc]">
              {(user.firstName || user.name || user.email || "?")
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => openAuthModal("premium")}
          aria-label="Premium"
          className="flex h-7 w-[35px] items-center justify-center"
        >
          <Image
            src="/mobile-nav/premium-diamond.png"
            alt=""
            width={35}
            height={28}
            className="h-7 w-[35px] object-contain"
          />
        </button>
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-[46px] items-center justify-center text-[#ccc]"
      >
        {open ? <X className="size-[26px]" /> : <Menu className="size-[26px]" />}
      </button>
    </div>
  );
}

function MobileSiteHeader({
  open,
  onToggle,
  onNavigate,
}: {
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="lg:hidden">
      <div
        className={`border-t border-[#5b6268] bg-[#191a1c] ${
          open ? "border-b" : "border-b-0"
        }`}
      >
        <div className="flex h-[54px] items-center gap-4 px-5">
          <HalalWallsLogo className="shrink-0 [&_img]:w-[140px]" />
          <div className="ml-auto">
            <MobileHeaderActions open={open} onToggle={onToggle} />
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
            className="overflow-hidden bg-[#191a1c]"
          >
            <div className="max-h-[calc(100dvh-54px)] overflow-y-auto px-4 py-10 pb-28">
              <Suspense fallback={null}>
                <MobileFilterMenu onNavigate={onNavigate} />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DesktopSiteHeader({
  search,
  onSearchChange,
  onSearchSubmit,
  showSearch,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (q: string) => void;
  showSearch: boolean;
}) {
  return (
    <div className="hidden bg-hw-bg lg:block">
      <div className="px-[var(--lp-header-inset-x)] pt-[var(--lp-header-inset-top)]">
        <div className="overflow-hidden rounded-[var(--lp-header-radius)] border-b-[length:var(--lp-header-accent)] border-hw-green bg-hw-header">
          <div className="lp-container flex h-[var(--lp-header-h)] items-center gap-4">
            <HalalWallsLogo className="shrink-0" />

            {showSearch && (
              <div className="ml-25 hidden flex-1 md:block lg:max-w-[337px]">
                <SearchBox
                  value={search}
                  onChange={onSearchChange}
                  onSubmit={onSearchSubmit}
                />
              </div>
            )}

            <div className="ml-auto flex items-center gap-5">
              <Suspense fallback={null}>
                <HeaderNav className="mx-auto" />
              </Suspense>
              <HeaderAuth />
              <ThemeToggle className="size-9" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const router = useRouter();
  const { open, setOpen } = useAuth();
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  useBodyScrollLock(open);

  const handleSearch = (q: string) => {
    if (q.trim()) router.push(`/?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50">
      <MobileSiteHeader
        open={open}
        onToggle={() => setOpen((o) => !o)}
        onNavigate={() => setOpen(false)}
      />
      <DesktopSiteHeader
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearch}
        showSearch={pathname !== "/"}
      />
    </header>
  );
}
