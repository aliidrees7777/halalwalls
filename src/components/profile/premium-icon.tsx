import Image from "next/image";
import { cn } from "@/lib/utils";

interface PremiumIconProps {
  className?: string;
  size?: number;
  /** When set, renders an SVG gem tinted to this color instead of the PNG. */
  color?: string;
}

export function PremiumIcon({ className, size = 16, color }: PremiumIconProps) {
  if (color) {
    const height = Math.round((size * 9) / 12);
    return (
      <svg
        width={size}
        height={height}
        viewBox="0 0 12 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("object-contain", className)}
        aria-hidden
      >
        <path d="M5.30357 0H2.00893L3.21429 1.8871L5.30357 0Z" fill={color} />
        <path
          d="M2.89375 1.95968L1.6875 0.0725806L0 1.95968H2.89375Z"
          fill={color}
        />
        <path
          d="M7.875 1.95968H3.69643L5.78571 0.0725806L7.875 1.95968Z"
          fill={color}
        />
        <path d="M9.5625 0H6.26786L8.27679 1.81452L9.5625 0Z" fill={color} />
        <path
          d="M9.88393 0.145161L8.59821 1.95968H11.5714L9.88393 0.145161Z"
          fill={color}
        />
        <path
          d="M3.05357 2.32258H0L5.22321 8.56452L3.05357 2.32258Z"
          fill={color}
        />
        <path
          d="M11.5714 2.32258H8.51786L6.34821 8.56452L11.5714 2.32258Z"
          fill={color}
        />
        <path
          d="M8.11607 2.32258H3.45536L5.78571 9L8.11607 2.32258Z"
          fill={color}
        />
      </svg>
    );
  }

  return (
    <Image
      src="/premium-icon.png"
      alt=""
      width={size}
      height={size}
      className={cn("object-contain", className)}
      aria-hidden
    />
  );
}
