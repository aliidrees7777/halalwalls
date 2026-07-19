"use client";

import Image from "next/image";
import { useRef } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImageToDataUrl } from "@/lib/image";
import { shouldUnoptimizeMedia } from "@/lib/media-url";
import pencil from "../../../../public/my-account/pencil.svg"
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
    // Compress in the browser so the data URL stays small (avatars ~256px,
    // banners ~1280px). Keeps the PATCH /me payload under the body limit.
    const maxDim = variant === "avatar" ? 256 : 1280;
    try {
      const dataUrl = await compressImageToDataUrl(file, maxDim, 0.82);
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
    <div className={cn(variant === "avatar" ? "shrink-0" : "min-w-0 flex-1")}>
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
          "group relative block overflow-hidden  bg-hw-card transition-all duration-200",
          "hover:border-hw-green/40 hover:shadow-[0_0_20px_rgba(0,255,163,0.08)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hw-green/50",
          variant === "avatar"
            ? " rounded-full ] w-[163px] h-[163px]"
            : "h-[88px] w-full rounded-md sm:h-[163px]"
        )}
        aria-label={`Change ${label}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={variant === "avatar" ? "96px" : "400px"}
          unoptimized={shouldUnoptimizeMedia(src)}
        />
        <span
          className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-90 transition-opacity duration-200 group-hover:bg-black/45"
          aria-hidden
        >
          <Image src={pencil} alt="pencil" className="size-4 text-white drop-shadow-sm sm:size-[35px]" />
          {/* <Pencil /> */}
        </span>
      </button>
    </div>
  );
}
