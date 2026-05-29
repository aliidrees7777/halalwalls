"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, LayoutGrid, TrendingUp } from "lucide-react";
import {
  desktopResolutions,
  mobileResolutions,
  sidebarCategories,
  trendingTopics,
} from "@/data/sidebar";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function ResolutionChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded-md border border-[#3a3f3d] bg-[#0d0f0e] px-1 py-2 text-center text-[11px] leading-tight text-hw-foreground transition-colors hover:border-hw-green/40"
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
        isPremium
          ? "border border-hw-yellow bg-transparent"
          : "bg-[#2a2f2d]"
      )}
    >
      {count}
    </span>
  );
}

export function HomeSidebar() {
  const [qrOpen, setQrOpen] = useState(true);

  return (
    <aside className="flex w-full flex-col gap-3 lg:w-[248px] lg:shrink-0">
      <SidebarPanel title="Resolution">
        <Select defaultValue="browse">
          <SelectTrigger className="h-9 w-full rounded-md border-[#3a3f3d] bg-[#0d0f0e] text-[13px] text-hw-muted shadow-none">
            <SelectValue placeholder="Browse Resolutions" />
          </SelectTrigger>
          <SelectContent className="border-[#2a2f2d] bg-hw-sidebar">
            <SelectItem value="browse">Browse Resolutions</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
          </SelectContent>
        </Select>

        <div className="mt-4">
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
      </SidebarPanel>

      <SidebarPanel title="Our App">
        <a
          href="#"
          className="flex items-center gap-3 rounded-md border border-[#3a3f3d] bg-[#0d0f0e] px-3 py-2.5 transition-opacity hover:opacity-90"
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
          className="mt-4 flex w-full items-center justify-center gap-1 text-[12px] text-hw-muted transition-colors hover:text-hw-foreground"
        >
          Scan QR Code
          <ChevronUp
            className={cn(
              "size-3.5 transition-transform",
              !qrOpen && "rotate-180"
            )}
          />
        </button>

        {qrOpen && (
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
        )}
      </SidebarPanel>

      <SidebarPanel title="Trending" icon={TrendingUp}>
        <ul>
          {trendingTopics.map((topic, index) => (
            <li
              key={topic}
              className={cn(index > 0 && "border-t border-[#2a2f2d]")}
            >
              <Link
                href="#"
                className="block py-2.5 text-[13px] text-hw-foreground transition-colors hover:text-hw-green"
              >
                {topic}
              </Link>
            </li>
          ))}
        </ul>
      </SidebarPanel>

      <SidebarPanel title="Categories" icon={LayoutGrid}>
        <Select defaultValue="browse">
          <SelectTrigger className="h-9 w-full rounded-md border-[#3a3f3d] bg-[#0d0f0e] text-[13px] text-hw-muted shadow-none">
            <SelectValue placeholder="Browse Categories" />
          </SelectTrigger>
          <SelectContent className="border-[#2a2f2d] bg-hw-sidebar">
            <SelectItem value="browse">Browse Categories</SelectItem>
            <SelectItem value="all">All Categories</SelectItem>
          </SelectContent>
        </Select>

        <ul className="mt-2">
          {sidebarCategories.map((category, index) => (
            <li
              key={category.name}
              className={cn(index > 0 && "border-t border-[#2a2f2d]")}
            >
              <Link
                href="#"
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
      </SidebarPanel>
    </aside>
  );
}
