"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Mobile-only circular back control — same look/position across popups. */
export function MobileModalBackButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className={cn(
        "absolute left-0 top-0 z-20 flex size-10 items-center justify-center rounded-full bg-[#191A1C] p-[10px] md:hidden",
        className,
      )}
    >
      <Image
        src="/back-button-dark.svg"
        alt=""
        width={14}
        height={12}
        className="h-3 w-[14px] object-contain"
        unoptimized
      />
    </button>
  );
}
