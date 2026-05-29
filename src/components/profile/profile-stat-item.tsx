"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileStatItemProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function ProfileStatItem({
  icon: Icon,
  label,
  count,
  onClick,
  className,
}: ProfileStatItemProps) {
  const content = (
    <>
      <Icon className="size-5 text-hw-foreground/90" strokeWidth={1.75} />
      <span className="mt-2 text-[13px] font-medium text-hw-foreground">
        {count !== undefined ? `${count} ${label}` : label}
      </span>
    </>
  );

  const sharedClass = cn(
    "flex flex-col items-center justify-center rounded-xl border border-white/10 bg-black/35 px-6 py-4 backdrop-blur-md",
    "min-w-[120px] sm:min-w-[140px]",
    className
  );

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={cn(sharedClass, "cursor-pointer transition-colors")}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={sharedClass}
    >
      {content}
    </motion.div>
  );
}
