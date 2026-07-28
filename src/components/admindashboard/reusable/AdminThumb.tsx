/* eslint-disable @next/next/no-img-element -- admin table thumbs use plain <img> */
"use client";

import { cn } from "@/lib/utils";

export type AdminThumbVariant = "rect" | "square";

/** Landscape wallpaper previews (original admin table size). */
export const ADMIN_THUMB_RECT = { w: 60, h: 36 } as const;
/** Square category / boxed previews. */
export const ADMIN_THUMB_SQUARE = { w: 44, h: 44 } as const;

interface AdminThumbProps {
  src?: string | null;
  alt?: string;
  /** `rect` = wallpapers (default). `square` = categories. */
  variant?: AdminThumbVariant;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Admin table preview thumb. Inline size beats Tailwind preflight
 * (`img { height: auto }`) so landscape sources don't force a wrong frame.
 */
export function AdminThumb({
  src,
  alt = "",
  variant = "rect",
  className,
  onClick,
  style,
}: AdminThumbProps) {
  const size = variant === "square" ? ADMIN_THUMB_SQUARE : ADMIN_THUMB_RECT;

  return (
    <div
      className={cn("shrink-0 overflow-hidden rounded-md bg-[var(--bg3)]", className)}
      style={{
        width: size.w,
        height: size.h,
        minWidth: size.w,
        minHeight: size.h,
        maxWidth: size.w,
        maxHeight: size.h,
        aspectRatio: `${size.w} / ${size.h}`,
        ...style,
      }}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : null}
    </div>
  );
}
