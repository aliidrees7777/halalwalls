/**
 * Admin panel permission keys ↔ sidebar / page gating.
 * Keys match backend `role.service.js` CATALOG.
 */

export type AdminPermission =
  | "dashboard.view"
  | "dashboard.stats"
  | "dashboard.export"
  | "dashboard.announcements"
  | "wallpapers.view"
  | "wallpapers.upload"
  | "wallpapers.edit"
  | "wallpapers.delete"
  | "wallpapers.moderate"
  | "cattags.view"
  | "cattags.edit"
  | "cattags.delete"
  | "resolutions.view"
  | "resolutions.edit"
  | "resolutions.delete"
  | "users.view"
  | "users.edit"
  | "users.delete"
  | "roles.view"
  | "roles.manage"
  | "subscriptions.view"
  | "payments.view"
  | "payments.refund"
  | "plans.manage"
  | "ads.view"
  | "ads.manage"
  | "settings.view"
  | "settings.manage";

/** Sidebar item name → required permission to see it. */
export const NAV_PERMISSION: Record<string, AdminPermission> = {
  Dashboard: "dashboard.view",
  Wallpapers: "wallpapers.view",
  Categories: "cattags.view",
  Tags: "cattags.view",
  Resolutions: "resolutions.view",
  Users: "users.view",
  Roles: "roles.view",
  Subscribers: "subscriptions.view",
  Settings: "settings.manage",
};

export function hasPermission(
  permissions: string[] | null | undefined,
  key: AdminPermission | string,
): boolean {
  if (!permissions || permissions.length === 0) return false;
  return permissions.includes(key);
}

/** Known catalog keys used when the API has not yet attached permissions. */
const FULL_ACCESS_FALLBACK = [
  "dashboard.view",
  "dashboard.stats",
  "dashboard.export",
  "dashboard.announcements",
  "wallpapers.view",
  "wallpapers.upload",
  "wallpapers.edit",
  "wallpapers.delete",
  "wallpapers.moderate",
  "cattags.view",
  "cattags.edit",
  "cattags.delete",
  "resolutions.view",
  "resolutions.edit",
  "resolutions.delete",
  "users.view",
  "users.edit",
  "users.delete",
  "roles.view",
  "roles.manage",
  "subscriptions.view",
  "payments.view",
  "payments.refund",
  "plans.manage",
  "ads.view",
  "ads.manage",
  "settings.view",
  "settings.manage",
];

/** Super-admin fallback when an older admin account has no permission payload yet. */
export function effectivePermissions(
  user: { role?: string; permissions?: string[] | null; adminRoleKey?: string | null } | null,
): string[] {
  if (!user || user.role !== "admin") return [];
  if (Array.isArray(user.permissions) && user.permissions.length > 0) {
    return user.permissions;
  }
  // Legacy admin accounts without a staff role → treat as Super Admin (full access).
  if (!user.adminRoleKey || user.adminRoleKey === "super-admin") {
    return FULL_ACCESS_FALLBACK;
  }
  return [];
}

export function canAccessNav(
  permissions: string[] | null | undefined,
  item: string,
): boolean {
  const required = NAV_PERMISSION[item];
  if (!required) return true;
  return hasPermission(permissions, required);
}
