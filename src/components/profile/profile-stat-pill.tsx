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
        "primary-font inline-flex h-[42.67px] items-center justify-center rounded-[10.67px] bg-black/50 px-[17.78px] text-[21px] font-normal leading-none text-white",
        className
      )}
    >
      {label}
    </motion.div>
  );
}
