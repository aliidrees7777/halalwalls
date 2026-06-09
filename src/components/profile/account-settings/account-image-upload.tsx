"use client";

import Image from "next/image";
import { useRef } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

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

  function handleFile(file: File | undefined) {
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
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
          "group relative block overflow-hidden border border-hw-border bg-hw-card transition-all duration-200",
          "hover:border-hw-green/40 hover:shadow-[0_0_20px_rgba(0,255,163,0.08)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hw-green/50",
          variant === "avatar"
            ? "size-[88px] rounded-full sm:size-[96px]"
            : "h-[88px] w-full rounded-xl sm:h-[96px]"
        )}
        aria-label={`Change ${label}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={variant === "avatar" ? "96px" : "400px"}
          unoptimized={src.startsWith("data:")}
        />
        <span
          className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-90 transition-opacity duration-200 group-hover:bg-black/45"
          aria-hidden
        >
          <Pencil className="size-4 text-white drop-shadow-sm sm:size-[18px]" />
        </span>
      </button>
    </div>
  );
}
