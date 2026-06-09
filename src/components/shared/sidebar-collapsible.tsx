"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
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
  children: ReactNode;
}

export function SidebarCollapsible({
  label,
  defaultOpen = false,
  scroll = false,
  maxHeightClass = "max-h-[320px]",
  children,
}: SidebarCollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-9 w-full items-center justify-between rounded-md border border-[#3a3f3d] bg-[#0d0f0e] px-3 text-[13px] text-hw-muted transition-colors hover:text-hw-foreground"
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-300",
            open && "rotate-180"
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
                "pt-3",
                scroll &&
                  cn(
                    "overflow-y-auto pr-1",
                    maxHeightClass,
                    "[scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#3a3f3d]"
                  )
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
