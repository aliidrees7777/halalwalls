import { cn } from "@/lib/utils";

interface AccountSectionTitleProps {
  children: React.ReactNode;
  variant?: "default" | "danger";
  className?: string;
}

export function AccountSectionTitle({
  children,
  variant = "default",
  className,
}: AccountSectionTitleProps) {
  return (
    <h3
      className={cn(
        "py-1 text-center text-xl font-semibold sm:text-2xl",
        variant === "danger" ? "text-[#B10000]" : "text-hw-foreground",
        className
      )}
    >
      {children}
    </h3>
  );
}
