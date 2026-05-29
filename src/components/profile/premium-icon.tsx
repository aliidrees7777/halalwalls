import Image from "next/image";
import { cn } from "@/lib/utils";

interface PremiumIconProps {
  className?: string;
  size?: number;
}

export function PremiumIcon({ className, size = 16 }: PremiumIconProps) {
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
