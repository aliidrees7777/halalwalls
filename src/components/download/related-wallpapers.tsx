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
      <SidebarPanel title="Related Wallpapers">
        <p className="py-6 text-center text-[13px] text-hw-muted">
          No related wallpapers yet.
        </p>
      </SidebarPanel>
    );
  }

  return (
    <SidebarPanel title="Related Wallpapers">
      {/* 2-col grid on mobile/tablet (matches Figma); single column in the narrow desktop sidebar */}
      <ul className="grid grid-cols-2 gap-2.5 xl:grid-cols-1">
        {items.map((wallpaper, index) => (
          <motion.li
            key={wallpaper.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.35 }}
          >
            <Link
              href={`/wallpaper/${wallpaper.slug}`}
              className="group relative block overflow-hidden rounded-lg border border-hw-line bg-hw-deep"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[16/10] w-full xl:aspect-[16/7]"
              >
                <Image
                  src={wallpaper.image}
                  alt={wallpaper.title}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                  sizes="(min-width: 1280px) 248px, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
