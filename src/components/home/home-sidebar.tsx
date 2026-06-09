"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, LayoutGrid, TrendingUp } from "lucide-react";
import {
  desktopResolutions,
  mobileResolutions,
  sidebarCategories,
  trendingTopics,
} from "@/data/sidebar";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import { SidebarCollapsible } from "@/components/shared/sidebar-collapsible";
import { cn } from "@/lib/utils";

function ResolutionChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded-md border border-hw-line bg-hw-deep px-1 py-2 text-center text-[11px] leading-tight text-hw-foreground transition-colors hover:border-hw-green/40"
    >
      {label}
    </button>
  );
}

function CategoryBadge({
  count,
  isPremium,
}: {
  count: number;
  isPremium?: boolean;
}) {
  return (
    <span
      className={cn(
        "min-w-[28px] rounded-full px-2 py-0.5 text-center text-[11px] font-medium tabular-nums text-hw-foreground",
        isPremium ? "border border-hw-yellow bg-transparent" : "bg-hw-line"
      )}
    >
      {count}
    </span>
  );
}

export function HomeSidebar() {
  const [qrOpen, setQrOpen] = useState(true);

  return (
    <aside className="hidden w-full flex-col gap-3 lg:flex lg:w-[248px] lg:shrink-0">
      <SidebarPanel title="Resolution">
        <SidebarCollapsible label="Browse Resolutions" defaultOpen>
          <div>
            <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-hw-muted">
              Popular Desktop
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {desktopResolutions.map((res) => (
                <ResolutionChip key={res} label={res} />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-hw-muted">
              Popular Mobile
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {mobileResolutions.map((res) => (
                <ResolutionChip key={res} label={res} />
              ))}
            </div>
          </div>
        </SidebarCollapsible>
      </SidebarPanel>

      <SidebarPanel title="Our App">
        <a
          href="https://play.google.com/store/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md border border-hw-line bg-hw-deep px-3 py-2.5 transition-opacity hover:opacity-90"
        >
          <Image
            src="/google-play-logo.png"
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 object-contain"
          />
          <div className="leading-tight">
            <p className="text-[9px] uppercase tracking-wide text-hw-muted">
              Get it on
            </p>
            <p className="text-sm font-semibold text-hw-foreground">Google Play</p>
          </div>
        </a>

        <button
          type="button"
          onClick={() => setQrOpen((v) => !v)}
          aria-expanded={qrOpen}
          className="mt-4 flex w-full items-center justify-center gap-1 text-[12px] text-hw-muted transition-colors hover:text-hw-foreground"
        >
          Scan QR Code
          <ChevronUp
            className={cn(
              "size-3.5 transition-transform duration-300",
              !qrOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {qrOpen && (
            <motion.div
              key="qr"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-col items-center">
                <div className="overflow-hidden rounded-lg bg-white p-2">
                  <Image
                    src="/qr-code-logo.png"
                    alt="Scan to download on Google Play"
                    width={160}
                    height={160}
                    className="size-[140px] object-contain"
                  />
                </div>
                <p className="mt-2 text-center text-[11px] text-hw-muted">
                  Google Play
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarPanel>

      <SidebarPanel title="Trending" icon={TrendingUp}>
        <ul>
          {trendingTopics.map((topic, index) => (
            <li
              key={topic}
              className={cn(index > 0 && "border-t border-hw-line")}
            >
              <Link
                href={`/?q=${encodeURIComponent(topic)}`}
                className="block py-2.5 text-[13px] text-hw-foreground transition-colors hover:text-hw-green"
              >
                {topic}
              </Link>
            </li>
          ))}
        </ul>
      </SidebarPanel>

      <SidebarPanel title="Categories" icon={LayoutGrid}>
        <SidebarCollapsible label="Browse Categories" defaultOpen>
          <ul>
            {sidebarCategories.map((category, index) => (
              <li
                key={category.name}
                className={cn(index > 0 && "border-t border-hw-line")}
              >
                <Link
                  href={category.slug ? `/?category=${category.slug}` : "/"}
                  className="flex items-center justify-between gap-2 py-2.5"
                >
                  <span
                    className={cn(
                      "text-[13px]",
                      category.isPremium
                        ? "font-medium text-hw-yellow"
                        : "text-hw-foreground"
                    )}
                  >
                    {category.isPremium ? `${category.name} 💎` : category.name}
                  </span>
                  <CategoryBadge
                    count={category.count}
                    isPremium={category.isPremium}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </SidebarCollapsible>
      </SidebarPanel>
    </aside>
  );
}
