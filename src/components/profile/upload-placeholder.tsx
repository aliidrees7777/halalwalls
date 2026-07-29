"use client";

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
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 rounded-md",
        "border-2 border-dashed border-hw-border bg-hw-card/50",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-[#2F4577] text-white sm:size-15">
        <Plus className="size-5" strokeWidth={2.5} />
      </span>
      <span className="text-sm font-medium text-hw-depw sm:text-[15px]">Add Wallpaper</span>
    </button>
  );
}
