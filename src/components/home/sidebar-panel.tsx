import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarPanelProps {
  title: string;
  icon?: LucideIcon;
  iconSrc?: string;
  iconClassName?: string;
  /** Where the icon sits relative to the title. Default: after. */
  iconPosition?: "before" | "after";
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export function SidebarPanel({
  title,
  icon: Icon,
  iconSrc,
  iconClassName = "h-[12.57px] w-[21.34px] shrink-0",
  iconPosition = "after",
  children,
  className,
  titleClassName,
}: SidebarPanelProps) {
  const iconEl = iconSrc ? (
    // Decorative SVG/PNG icons — plain <img> avoids next/image aspect warnings
    // on tiny assets where CSS size differs from intrinsic dims.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={iconSrc} alt="" className={iconClassName} />
  ) : Icon ? (
    <Icon
      className="size-[17.78px] shrink-0 text-hw-foreground"
      strokeWidth={2.5}
    />
  ) : null;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--lp-panel-radius)] border-[length:var(--lp-panel-border)] border-hw-line bg-hw-sidebar",
        className,
      )}
    >
      <h2
        className={cn(
          "flex h-[49.7px] items-center justify-center gap-[5.33px] text-[length:var(--lp-panel-title)] font-bold leading-[22px] text-hw-foreground",
          titleClassName,
        )}
      >
        {iconPosition === "before" ? iconEl : null}
        {title}
        {iconPosition === "after" ? iconEl : null}
      </h2>
      <div
        className="border-b-[length:var(--lp-panel-divider)] border-hw-line"
        aria-hidden
      />
      {children}
    </section>
  );
}
