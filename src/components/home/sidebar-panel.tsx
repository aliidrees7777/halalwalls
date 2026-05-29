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
        "rounded-lg border border-[#2a2f2d] bg-hw-sidebar p-4",
        className
      )}
    >
      <h2 className="mb-3 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-hw-foreground">
        {title}
        {Icon && <Icon className="size-3.5 text-hw-muted" strokeWidth={2} />}
      </h2>
      {children}
    </section>
  );
}
