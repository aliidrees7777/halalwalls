import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

const sizeClass: Record<SpinnerSize, string> = {
  sm: "size-5 border-2",
  md: "size-8 border-2",
  lg: "size-12 border-[3px]",
};

/**
 * Brand-colored circular spinner used site-wide instead of "Loading…" text.
 */
export function LoadingSpinner({
  className,
  size = "md",
  label = "Loading",
}: {
  className?: string;
  size?: SpinnerSize;
  /** Accessible label for screen readers. */
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "animate-spin rounded-full border-hw-green/25 border-t-hw-green",
        sizeClass[size],
        className,
      )}
    />
  );
}

/** Centered spinner block for page / section loading states. */
export function LoadingBlock({
  className,
  size = "md",
  label = "Loading",
}: {
  className?: string;
  size?: SpinnerSize;
  label?: string;
}) {
  return (
    <div className={cn("grid place-items-center py-12", className)}>
      <LoadingSpinner size={size} label={label} />
    </div>
  );
}
