"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSideIconButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  icon?: LucideIcon;
  iconNode?: React.ReactNode;
}

export function ProfileSideIconButton({
  label,
  onClick,
  className,
  icon: Icon,
  iconNode,
}: ProfileSideIconButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.08, backgroundColor: "rgba(0,0,0,0.55)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      aria-label={label}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full",
        "border border-white/10 bg-black/40 text-hw-foreground backdrop-blur-sm",
        "transition-colors sm:size-10",
        className
      )}
    >
      {iconNode ?? (Icon && <Icon className="size-[18px] sm:size-5" strokeWidth={1.75} />)}
    </motion.button>
  );
}
