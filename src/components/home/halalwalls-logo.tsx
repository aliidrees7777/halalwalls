import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HalalWallsLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/logo.svg"
        alt=""
        width={185}
        height={36}
        className="shrink-0 w-[175px] md:w-[185px] h-auto"
        priority
      />
    </Link>
  );
}
