import Image from "next/image";
import { cn } from "@/lib/utils";
import closeDarkDesktop from "../../../public/cross-icon-darkmode.svg";
import closeLightDesktop from "../../../public/cross-icon-lightmode.svg";
import closeLightMobile from "../../../public/Cancel-icon-lightmode.svg";

interface ModalCloseIconProps {
  className?: string;
  size?: number;
}

/**
 * Light mobile: Cancel-icon-lightmode.svg
 * Light desktop: cross-icon-lightmode.svg
 * Dark desktop: cross-icon-darkmode.svg
 */
export function ModalCloseIcon({ className, size = 26 }: ModalCloseIconProps) {
  return (
    <span className={cn("inline-flex", className)}>
      <Image
        src={closeLightMobile}
        alt=""
        width={size}
        height={size}
        className="dark:hidden md:hidden"
      />
      <Image
        src={closeLightDesktop}
        alt=""
        width={size}
        height={size}
        className="hidden md:block dark:hidden"
      />
      <Image
        src={closeDarkDesktop}
        alt=""
        width={size}
        height={size}
        className="hidden dark:md:block"
      />
    </span>
  );
}
