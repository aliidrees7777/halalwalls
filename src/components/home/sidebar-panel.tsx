import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarPanelProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function SidebarPanel({
  title,
  icon: Icon,
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
        {Icon && (
          <Icon
            className="size-[17.78px] text-hw-foreground"
            strokeWidth={2.5}
          />
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
