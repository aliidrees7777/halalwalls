import { BadgeCheck, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CertificationLevel } from "@/types";

const config: Record<
  CertificationLevel,
  { label: string; className: string; icon: typeof BadgeCheck }
> = {
  Certified: {
    label: "Halal Certified",
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    icon: BadgeCheck,
  },
  "Muslim-Owned": {
    label: "Muslim Owned",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    icon: Shield,
  },
  "Halal Menu": {
    label: "Halal Menu",
    className: "bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30",
    icon: BadgeCheck,
  },
  Verified: {
    label: "Community Verified",
    className: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30",
    icon: BadgeCheck,
  },
};

export function HalalBadge({
  certification,
  className,
}: {
  certification: CertificationLevel;
  className?: string;
}) {
  const { label, className: badgeClass, icon: Icon } = config[certification];

  return (
    <Badge
      variant="outline"
      className={cn("gap-1 font-medium", badgeClass, className)}
    >
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}
