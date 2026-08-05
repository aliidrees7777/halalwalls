"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Animated accordion panel for the sidebar (HDQwalls-style open/close):
 * smooth height expand/collapse, chevron rotation, and an optional inner
 * scroll area for long lists. Design is ours; only the effect mirrors HDQwalls.
 */
interface SidebarCollapsibleProps {
  label: string;
  defaultOpen?: boolean;
  scroll?: boolean;
  maxHeightClass?: string;
  labelClassName?: string;
  contentClassName?: string;
  children: ReactNode;
}

export function SidebarCollapsible({
  label,
  defaultOpen = false,
  scroll = false,
  maxHeightClass = "max-h-[320px]",
  labelClassName,
  contentClassName = "pt-3",
  children,
}: SidebarCollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex h-[39px] w-full items-center justify-between border-y-[length:var(--lp-panel-divider-thin)] border-hw-line text-[length:var(--lp-panel-label)] font-medium text-hw-foreground transition-colors hover:text-hw-green",
          labelClassName,
        )}
      >
        <span className="pl-4">{label}</span>
        {/* Light: dedicated up/down assets. Dark: existing chevron + rotate. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={open ? "/arrow-up-lightmode.svg" : "/arrow-down-lightmode.svg"}
          alt=""
          width={12}
          height={7}
          className="mr-[10px] dark:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/arow.svg"
          alt=""
          width={12}
          height={7}
          className={cn(
            "mr-[10px] hidden transition-transform duration-200 dark:block",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                contentClassName,
                scroll &&
                  cn(
                    "overflow-y-auto pr-1",
                    maxHeightClass,
                    "[scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-hw-line",
                  ),
              )}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
