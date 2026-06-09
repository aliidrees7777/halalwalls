"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Plus, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile fixed bottom navigation (client's Note 8 + mobile Figma):
 * black bar, green top border, rounded top corners, 5 icon items with a
 * prominent circular "+" (Add/Upload) in the center. Mobile only (md:hidden).
 * Inactive icons #727272, active = brand green.
 */
const sideItems = [
  { label: "Home", href: "/", icon: Home, match: (p: string) => p === "/" },
  { label: "Categories", href: "/", icon: LayoutGrid, match: () => false },
];

const rightItems = [
  { label: "Favorites", href: "/profile", icon: Heart, match: () => false },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    match: (p: string) => p.startsWith("/profile"),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const itemClass = (active: boolean) =>
    cn(
      "flex items-center justify-center transition-colors",
      active ? "text-hw-green" : "text-[#727272] hover:text-hw-foreground"
    );

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 h-[68px] rounded-t-[28px] border-t border-hw-green bg-black md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex h-full max-w-[360px] items-center justify-around px-5">
        {sideItems.map(({ label, href, icon: Icon, match }) => (
          <Link key={label} href={href} aria-label={label} className={itemClass(match(pathname))}>
            <Icon className="size-6" />
          </Link>
        ))}

        {/* Center Add (+) — prominent circular button */}
        <Link
          href="/upload"
          aria-label="Add wallpaper"
          className={cn(
            "grid size-12 place-items-center rounded-full border-[3px] bg-black transition-colors",
            pathname === "/upload"
              ? "border-hw-green text-hw-green"
              : "border-[#727272] text-[#727272] hover:border-hw-foreground hover:text-hw-foreground"
          )}
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </Link>

        {rightItems.map(({ label, href, icon: Icon, match }) => (
          <Link key={label} href={href} aria-label={label} className={itemClass(match(pathname))}>
            <Icon className="size-6" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
