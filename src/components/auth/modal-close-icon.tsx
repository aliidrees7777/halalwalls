import Image from "next/image";
import { cn } from "@/lib/utils";
import closeDark from "../../../public/authicon/close.svg";
import closeLight from "../../../public/Cancel-icon-lightmode.svg";

interface ModalCloseIconProps {
  className?: string;
  size?: number;
}

/** Light: Cancel-icon-lightmode.svg · Dark: authicon/close.svg */
export function ModalCloseIcon({ className, size = 26 }: ModalCloseIconProps) {
  return (
    <span className={cn("inline-flex", className)}>
      <Image
        src={closeLight}
        alt=""
        width={size}
        height={size}
        className="dark:hidden"
      />
      <Image
        src={closeDark}
        alt=""
        width={size}
        height={size}
        className="hidden dark:block"
      />
    </span>
  );
}
