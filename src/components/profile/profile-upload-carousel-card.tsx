"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

interface ProfileUploadCarouselCardProps {
  className?: string;
}

/** Figma uploads carousel — dashed add wallpaper card (123.316 × 277px) */
export function ProfileUploadCarouselCard({
  className,
}: ProfileUploadCarouselCardProps) {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();

  function handleClick() {
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
        "relative flex h-[277px] w-[123.316px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-[8.212px] border-[1.909px] border-dashed border-[#6e6f74] bg-[#181a1b]",
        className,
      )}
    >
      <div className="flex w-[69px] flex-col items-center gap-[9.929px]">
        <Image
          src="/profile/add-wallpaper.svg"
          alt=""
          width={27}
          height={27}
          className="size-[26.634px]"
          aria-hidden
        />
        <span className="w-full text-center text-[9.929px] font-medium text-white">
          Add Wallpaper
        </span>
      </div>
    </button>
  );
}
