import Image from "next/image";
import { cn } from "@/lib/utils";

interface GooglePlayButtonProps {
  className?: string;
  compact?: boolean;
}

export function GooglePlayButton({
  className,
  compact = false,
}: GooglePlayButtonProps) {
  return (
    <a
      href="https://play.google.com/store/apps"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 rounded-md border border-[#3a3f3d] bg-[#0d0f0e] transition-opacity hover:opacity-90",
        compact ? "px-2.5 py-2" : "px-3 py-2.5",
        className
      )}
    >
      <Image
        src="/google-play-logo.png"
        alt=""
        width={40}
        height={40}
        className={cn("shrink-0 object-contain", compact ? "size-8" : "size-10")}
      />
      <div className="leading-tight">
        <p className="text-[9px] uppercase tracking-wide text-hw-muted">
          Get it on
        </p>
        <p
          className={cn(
            "font-semibold text-hw-foreground",
            compact ? "text-xs" : "text-sm"
          )}
        >
          Google Play
        </p>
      </div>
    </a>
  );
}
