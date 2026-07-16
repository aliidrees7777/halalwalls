import type { AuthUser } from "@/context/auth-context";

/** Premium entitlements on the public site (downloads, no-ads UI, etc.). */
export function hasPremiumAccess(
  user: Pick<AuthUser, "isPremium" | "role"> | null | undefined,
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return !!user.isPremium;
}
