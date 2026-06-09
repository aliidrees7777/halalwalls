"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, LayoutGrid, Plus, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile fixed bottom navigation (client's Note 8 + mobile Figma):
 * black bar, green top border, rounded top corners, 5 icon items with a
 * prominent circular "+" (Add/Upload) in the center. Mobile only (md:hidden).
 * Inactive icons #727272, active = brand green. Every item navigates to a
 * distinct destination and gives a tap animation so a press always responds.
 */
const MotionLink = motion.create(Link);

const sideItems = [
  { label: "Home", href: "/", icon: Home, match: (p: string) => p === "/" },
  {
    label: "Categories",
    href: "/?category=popular",
    icon: LayoutGrid,
    match: () => false,
  },
];

const rightItems = [
  {
    label: "Favorites",
    href: "/profile?tab=favorites",
    icon: Heart,
    match: () => false,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    match: (p: string) => p.startsWith("/profile"),
  },
];

const tap = { scale: 0.82 };
const tapTransition = { type: "spring", stiffness: 500, damping: 24 } as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  const itemClass = (active: boolean) =>
    cn(
      "flex items-center justify-center transition-colors",
      active ? "text-hw-green" : "text-hw-icon hover:text-hw-foreground"
    );

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 h-[68px] rounded-t-[28px] border-t border-hw-green bg-black md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex h-full max-w-[360px] items-center justify-around px-5">
        {sideItems.map(({ label, href, icon: Icon, match }) => (
          <MotionLink
            key={label}
            href={href}
            aria-label={label}
            whileTap={tap}
            transition={tapTransition}
            className={itemClass(match(pathname))}
          >
            <Icon className="size-6" />
          </MotionLink>
        ))}

        {/* Center Add (+) — prominent circular button */}
        <MotionLink
          href="/upload"
          aria-label="Add wallpaper"
          whileTap={{ scale: 0.9 }}
          transition={tapTransition}
          className={cn(
            "grid size-12 place-items-center rounded-full border-[3px] bg-black transition-colors",
            pathname === "/upload"
              ? "border-hw-green text-hw-green"
              : "border-hw-icon text-hw-icon hover:border-hw-foreground hover:text-hw-foreground"
          )}
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </MotionLink>

        {rightItems.map(({ label, href, icon: Icon, match }) => (
          <MotionLink
            key={label}
            href={href}
            aria-label={label}
            whileTap={tap}
            transition={tapTransition}
            className={itemClass(match(pathname))}
          >
            <Icon className="size-6" />
          </MotionLink>
        ))}
      </div>
    </nav>
  );
}
