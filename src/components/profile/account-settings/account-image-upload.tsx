"use client";

import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { compressImageToDataUrl } from "@/lib/image";
import { shouldUnoptimizeMedia, upgradeAvatarUrl } from "@/lib/media-url";
import pencil from "../../../../public/Pencil.svg";

interface AccountImageUploadProps {
  label: string;
  src: string;
  alt: string;
  variant: "avatar" | "banner";
  onChange: (dataUrl: string) => void;
}

export function AccountImageUpload({
  label,
  src,
  alt,
  variant,
  onChange,
}: AccountImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file?.type.startsWith("image/")) return;
    // Compress in the browser so the data URL stays under the body limit,
    // but keep enough resolution for retina profile displays (avatar ~214px CSS).
    const maxDim = variant === "avatar" ? 720 : 1920;
    try {
      const dataUrl = await compressImageToDataUrl(file, maxDim, 0.92);
      onChange(dataUrl);
    } catch {
      // Fallback: raw read if canvas/compression isn't available.
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className={cn(variant === "avatar" ? "shrink-0" : "shrink-0 sm:min-w-0 sm:flex-1")}>
      <span className="sr-only">{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative block overflow-hidden bg-hw-card transition-all duration-200",
          "hover:border-hw-green/40 hover:shadow-[0_0_20px_rgba(0,255,163,0.08)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hw-green/50",
          variant === "avatar"
            ? "h-[100px] w-[100px] rounded-full sm:h-[163px] sm:w-[163px]"
            : "h-[60.7px] w-[182px] shrink-0 rounded-[3.64px] sm:h-[163px] sm:w-full sm:rounded-md",
        )}
        aria-label={`Change ${label}`}
      >
        <Image
          src={upgradeAvatarUrl(src, variant === "avatar" ? 512 : 1280) || src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={variant === "avatar" ? "326px" : "800px"}
          quality={95}
          unoptimized={shouldUnoptimizeMedia(src)}
        />
        <span
          className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-90 transition-opacity duration-200 group-hover:bg-black/45"
          aria-hidden
        >
          <Image
            src={pencil}
            alt=""
            width={36}
            height={36}
            className="size-[22px] object-contain drop-shadow-sm sm:size-10"
          />
        </span>
      </button>
    </div>
  );
}
