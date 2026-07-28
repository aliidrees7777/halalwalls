/* eslint-disable @next/next/no-img-element -- admin table thumbs use plain <img> */
"use client";

import { cn } from "@/lib/utils";

/** Square preview size used in every admin list/table. */
export const ADMIN_THUMB_PX = 44;

interface AdminThumbProps {
  src?: string | null;
  alt?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Forced 1×1 preview. Inline dimensions beat Tailwind preflight
 * (`img { height: auto }`) which otherwise lets landscape images stay rectangular.
 */
export function AdminThumb({
  src,
  alt = "",
  className,
  onClick,
  style,
}: AdminThumbProps) {
  return (
    <div
      className={cn("shrink-0 overflow-hidden rounded-md bg-[var(--bg3)]", className)}
      style={{
        width: ADMIN_THUMB_PX,
        height: ADMIN_THUMB_PX,
        minWidth: ADMIN_THUMB_PX,
        minHeight: ADMIN_THUMB_PX,
        maxWidth: ADMIN_THUMB_PX,
        maxHeight: ADMIN_THUMB_PX,
        aspectRatio: "1 / 1",
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
