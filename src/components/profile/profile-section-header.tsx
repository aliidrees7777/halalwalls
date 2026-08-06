import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSectionHeaderProps {
  title: string;
  seeAllHref?: string | null;
  className?: string;
  titleClassName?: string;
  seeAllClassName?: string;
}

export function ProfileSectionHeader({
  title,
  seeAllHref = "#",
  className,
  titleClassName,
  seeAllClassName,
}: ProfileSectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex items-center justify-between gap-4",
        className,
      )}
    >
      <h2
        className={cn(
          "text-[31px] font-semibold leading-none text-hw-foreground",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {seeAllHref ? (
        <Link
          href={seeAllHref}
          className={cn(
            "flex shrink-0 items-center gap-2 text-[13.342px] font-semibold leading-none text-[#0090FF] transition-opacity hover:opacity-80 md:gap-[9.53px] md:text-2xl dark:text-[#69a6d5]",
            seeAllClassName,
          )}
        >
          See All
          <ChevronRight className="size-3.5 shrink-0 md:size-6" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
