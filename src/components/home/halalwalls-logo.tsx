import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HalalWallsLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/hw-logo.png"
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0"
        priority
      />
      <span className="text-[17px] font-bold tracking-tight text-hw-foreground">
        HalalWalls
      </span>
    </Link>
  );
}
