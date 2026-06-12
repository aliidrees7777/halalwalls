"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Smartphone, Apple, Send, Contrast, Moon, Sun } from "lucide-react";
import { filterPills } from "@/data/filters";
import { useCategories, useResolutions } from "@/hooks/use-catalog";
import { buildFilterHref, normalizeResolution } from "@/lib/filter-url";
import { cn } from "@/lib/utils";

/**
 * Mobile burger-menu Filters drawer — matches the HDQwalls / Figma mobile menu:
 * BROWSE, CATEGORIES, RESOLUTIONS, GET THE APP, THEME. Uses our own categories.
 */
const browse = filterPills.filter((p) => ["latest", "random", "popular"].includes(p.id));

const pillBase =
  "inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-hw-foreground transition-colors";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-hw-muted">
      {children}
    </p>
  );
}

const themeOptions = [
  { value: "system", label: "Auto", icon: Contrast },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
] as const;

export function MobileFilterMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { theme, setTheme } = useTheme();
  const { categories } = useCategories();
  const res = useResolutions();
  const resolutions = [...res.desktop, ...res.mobile];
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col gap-7 pt-2">
      {/* BROWSE */}
      <section className="flex flex-col gap-3">
        <SectionLabel>Browse</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {browse.map((p) => (
            <Link
              key={p.id}
              href={buildFilterHref(searchParams, { sort: p.id })}
              onClick={onNavigate}
              className={cn(pillBase, "bg-hw-pill2 hover:bg-hw-pill2-hover")}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="flex flex-col gap-3">
        <SectionLabel>Categories</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={buildFilterHref(searchParams, { category: c.slug })}
              onClick={onNavigate}
              className={cn(pillBase, "border border-hw-input-border bg-hw-pill2 hover:border-hw-faint")}
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/"
            onClick={onNavigate}
            className={cn(pillBase, "border border-[#819CE4] bg-transparent text-[#819CE4]")}
          >
            All {categories.length}+
          </Link>
        </div>
      </section>

      {/* RESOLUTIONS */}
      <section className="flex flex-col gap-3">
        <SectionLabel>Resolutions</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {resolutions.map((r) => (
            <Link
              key={r}
              href={buildFilterHref(searchParams, { resolution: normalizeResolution(r) })}
              onClick={onNavigate}
              className={cn(pillBase, "border border-hw-input-border bg-hw-pill2 hover:border-hw-faint")}
            >
              {r}
            </Link>
          ))}
          <button
            type="button"
            className={cn(pillBase, "border border-[#819CE4] bg-transparent text-[#819CE4]")}
          >
            All Resolutions +
          </button>
        </div>
      </section>

      {/* GET THE APP */}
      <section className="flex flex-col gap-3">
        <SectionLabel>Get the App</SectionLabel>
        <div className="flex flex-wrap gap-2.5">
          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(pillBase, "bg-hw-pill2 hover:bg-hw-pill2-hover")}
          >
            <Smartphone className="size-4 text-[#95CF00]" />
            Android
          </a>
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(pillBase, "bg-hw-pill2 hover:bg-hw-pill2-hover")}
          >
            <Apple className="size-4" />
            iOS
          </a>
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(pillBase, "bg-hw-pill2 hover:bg-hw-pill2-hover")}
          >
            <Send className="size-4 text-[#25A1DF]" />
            Telegram
          </a>
        </div>
      </section>

      {/* THEME */}
      <section className="flex flex-col gap-3">
        <SectionLabel>Theme</SectionLabel>
        <div className="flex flex-wrap gap-2.5">
          {themeOptions.map(({ value, label, icon: Icon }) => {
            const active = mounted && theme === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-pressed={active}
                className={cn(
                  pillBase,
                  "bg-hw-pill2 hover:bg-hw-pill2-hover",
                  active && "border border-hw-green/60 text-hw-green"
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
