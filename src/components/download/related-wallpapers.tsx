"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import type { Wallpaper } from "@/types/wallpaper";

interface RelatedWallpapersProps {
  items: Wallpaper[];
}

export function RelatedWallpapers({ items }: RelatedWallpapersProps) {
  if (items.length === 0) {
    return (
      <SidebarPanel title="Related Content">
        <p className="py-6 text-center text-[length:var(--lp-panel-item)] text-hw-muted">
          No related wallpapers yet.
        </p>
      </SidebarPanel>
    );
  }

  return (
    <SidebarPanel title="Related Content">
      <ul className="grid grid-cols-2 gap-[var(--lp-grid-gap)] lg:grid-cols-1">
        {items.map((wallpaper, index) => (
          <motion.li
            key={wallpaper.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.35 }}
          >
            <Link
              href={`/wallpaper/${wallpaper.slug}`}
              className="group relative block h-[236px] overflow-hidden rounded-[var(--lp-card-radius)] border-[length:var(--lp-card-border)] border-hw-line bg-hw-deep"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full"
              >
                <Image
                  src={wallpaper.image}
                  alt={wallpaper.title}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
                <p className="absolute bottom-2 left-2 right-2 truncate text-[11px] font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {wallpaper.title}
                </p>
              </motion.div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </SidebarPanel>
  );
}
