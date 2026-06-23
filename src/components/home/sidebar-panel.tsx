import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import download from "../../../public/download.svg"
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
        "rounded-sm border-2 border-hw-line bg-hw-sidebar py-4",
        className
      )}
    >
      <h2 className="mb-3 flex items-center justify-center  gap-1.5 text-[18px] font-bold text-hw-muted">
        {title}
        {Icon && <Icon className="size-3.5 text-hw-muted" strokeWidth={4} />}
      </h2>
      {children}
    </section>
  );
}
