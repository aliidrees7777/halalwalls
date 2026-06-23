import Image from "next/image";
import { cn } from "@/lib/utils";

interface PremiumIconProps {
  className?: string;
  size?: number;
}

export function PremiumWhiteIcon({ className, size = 16 }: PremiumIconProps) {
  return (
    <Image
      src="/my-account/dimondwhite.svg"
      alt=""
      width={size}
      height={size}
      className={cn("object-contain", className)}
      aria-hidden
    />
  );
}
