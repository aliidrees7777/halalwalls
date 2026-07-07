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
        <svg
          width="12.45"
          height="7.11"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "mr-[10px] transition-transform duration-200",
            open || "rotate-180",
          )}
        >
          <path
            d="M9.4199 0H0.890855C0.126943 0 -0.281331 0.89974 0.221709 1.47464L4.48623 6.34838C4.84047 6.75323 5.47028 6.75323 5.82452 6.34838L10.089 1.47464C10.5921 0.89974 10.1838 0 9.4199 0Z"
            fill="#A8A299"
          />
        </svg>
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
