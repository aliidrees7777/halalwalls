import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarPanelProps {
  title: string;
  icon?: LucideIcon;
  iconSrc?: string;
  iconClassName?: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarPanel({
  title,
  icon: Icon,
  iconSrc,
  iconClassName = "h-[12.57px] w-[21.34px] shrink-0",
  children,
  className,
}: SidebarPanelProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--lp-panel-radius)] border-[length:var(--lp-panel-border)] border-hw-line bg-hw-sidebar",
        className,
      )}
    >
      <h2 className="flex h-[49.7px] items-center justify-center gap-[5.33px] text-[length:var(--lp-panel-title)] font-bold leading-[22px] text-hw-foreground">
        {title}
        {iconSrc ? (
          // Decorative SVG icons — plain <img> avoids next/image aspect warnings
          // on tiny assets where CSS size differs from intrinsic SVG dims.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconSrc} alt="" className={iconClassName} />
        ) : (
          Icon && (
            <Icon
              className="size-[17.78px] text-hw-foreground"
              strokeWidth={2.5}
            />
          )
        )}
      </h2>
      <div
        className="border-b-[length:var(--lp-panel-divider)] border-hw-line"
        aria-hidden
      />
      {children}
    </section>
  );
}
