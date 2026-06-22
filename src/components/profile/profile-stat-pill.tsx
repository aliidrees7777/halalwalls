"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProfileStatPillProps {
  label: string;
  className?: string;
}

export function ProfileStatPill({ label, className }: ProfileStatPillProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-full border border-white/10 bg-black/40 px-5 py-2 text-[21px] font-medium text-hw-depw",
        className
      )}
    >
      {label}
    </motion.div>
  );
}
