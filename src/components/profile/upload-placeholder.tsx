"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

interface UploadPlaceholderProps {
  className?: string;
  onClick?: () => void;
}

export function UploadPlaceholder({ className, onClick }: UploadPlaceholderProps) {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();

  function handleClick() {
    if (onClick) {
      onClick();
      return;
    }
    if (!isAuthenticated) {
      openAuthModal("signin");
      return;
    }
    router.push("/upload");
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.02, borderColor: "rgba(59,130,246,0.5)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex aspect-[16/10] w-full max-w-[400px] flex-col items-center justify-center gap-3 rounded-xl",
        "border-2 border-dashed border-hw-border bg-hw-card/50 transition-colors hover:bg-hw-card/80",
        className
      )}
    >
      <span className="flex size-15 items-center justify-center rounded-full bg-[#2F4577] text-white shadow-lg shadow-[#3b82f6]/25">
        <Plus className="size-5" strokeWidth={2.5} />
      </span>
      <span className="text-[15px] font-medium text-hw-depw">Add Wallpaper</span>
    </motion.button>
  );
}
