import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSectionHeaderProps {
  title: string;
  seeAllHref?: string | null;
  className?: string;
}

export function ProfileSectionHeader({
  title,
  seeAllHref = "#",
  className,
}: ProfileSectionHeaderProps) {
  return (
    <div
      className={cn(
        "lg:mb-4 flex items-center justify-between gap-4",
        className
      )}
    >
      <h2 className="text-[15px] font-semibold text-hw-foreground sm:text-base">
        {title}
      </h2>
      {seeAllHref && (
        <Link
          href={seeAllHref}
          className="flex shrink-0 items-center gap-[9.53px] text-[13.342px] font-semibold text-[#69a6d5] transition-opacity hover:opacity-80 md:text-2xl"
        >
          See All
          <ChevronRight className="size-3.5 md:size-6" />
        </Link>
      )}
    </div>
  );
}
