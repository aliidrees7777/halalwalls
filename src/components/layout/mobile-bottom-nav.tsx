"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";

/**
 * Mobile fixed bottom navigation: black bar, green top border, rounded top
 * corners, 5 custom icon items with a prominent circular "+" (Upload) center.
 * Mobile only (md:hidden). Each item has active + inactive PNG states.
 */
const MotionLink = motion.create(Link);

type NavItem = {
  label: string;
  href: string;
  icon: string;
  iconActive: string;
  size?: number;
  match: (pathname: string, hasCategory: boolean) => boolean;
};

const sideItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: "/mobile-nav/home.png",
    iconActive: "/mobile-nav/home-active.png",
    match: (p, hasCategory) => p === "/" && !hasCategory,
  },
  {
    label: "Categories",
    href: "/?category=islamic",
    icon: "/mobile-nav/categories.png",
    iconActive: "/mobile-nav/categories-active.png",
    match: (p, hasCategory) => p === "/" && hasCategory,
  },
];

const rightItems: NavItem[] = [
  {
    label: "Favorites",
    href: "/profile/favorites",
    icon: "/mobile-nav/favorites.png",
    iconActive: "/mobile-nav/favorites-active.png",
    match: (p) => p.startsWith("/profile/favorites"),
  },
];

const profileItem: NavItem = {
  label: "Profile",
  href: "/profile",
  icon: "/mobile-nav/profile.png",
  iconActive: "/mobile-nav/profile-active.png",
  match: (p) => p.startsWith("/profile") && !p.startsWith("/profile/favorites"),
};

const tap = { scale: 0.82 };
const tapTransition = { type: "spring", stiffness: 500, damping: 24 } as const;

function NavIcon({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  const size = item.size ?? 40;

  return (
    <Image
      src={active ? item.iconActive : item.icon}
      alt=""
      width={size}
      height={size}
      aria-hidden
      className="pointer-events-none select-none"
    />
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasCategory = Boolean(searchParams.get("category"));
  const { isAuthenticated, openAuthModal } = useAuth();
  const profileActive = profileItem.match(pathname, hasCategory);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 h-[92px] rounded-t-[28px] border-t border-hw-green bg-black md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex h-full max-w-[360px] items-center justify-around">
        {sideItems.map((item) => {
          const active = item.match(pathname, hasCategory);
          return (
            <MotionLink
              key={item.label}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              whileTap={tap}
              transition={tapTransition}
              className="flex items-center justify-center"
            >
              <NavIcon item={item} active={active} />
            </MotionLink>
          );
        })}

        <MotionLink
          href="/upload"
          aria-label="Add wallpaper"
          aria-current={pathname === "/upload" ? "page" : undefined}
          whileTap={{ scale: 0.9 }}
          transition={tapTransition}
          className="flex items-center justify-center"
        >
          <NavIcon
            item={{
              label: "Add",
              href: "/upload",
              icon: "/mobile-nav/add.png",
              iconActive: "/mobile-nav/add-active.png",
              size: 56,
              match: (p) => p === "/upload",
            }}
            active={pathname === "/upload"}
          />
        </MotionLink>

        {rightItems.map((item) => {
          const active = item.match(pathname, hasCategory);
          return (
            <MotionLink
              key={item.label}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              whileTap={tap}
              transition={tapTransition}
              className="flex items-center justify-center"
            >
              <NavIcon item={item} active={active} />
            </MotionLink>
          );
        })}

        {/* Always the same element type so SSR (auth still loading) and the
            client (Suspense may resume after auth has settled) don't mismatch. */}
        <MotionLink
          href={profileItem.href}
          aria-label={profileItem.label}
          aria-current={profileActive ? "page" : undefined}
          whileTap={tap}
          transition={tapTransition}
          className="flex items-center justify-center"
          onClick={(e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              openAuthModal("signin");
            }
          }}
        >
          <NavIcon item={profileItem} active={profileActive} />
        </MotionLink>
      </div>
    </nav>
  );
}
