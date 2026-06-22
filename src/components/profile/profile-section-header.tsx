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
        "mb-4 flex items-center justify-between gap-4",
        className
      )}
    >
      <h2 className="text-[15px] font-semibold text-hw-foreground sm:text-base">
        {title}
      </h2>
      {seeAllHref && (
        <Link
          href={seeAllHref}
          className="flex mt-20 shrink-0 items-center gap-0.5 text-[13px] font-medium text-[#3b82f6] transition-opacity hover:opacity-80"
        >
          See All
          <ChevronRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
