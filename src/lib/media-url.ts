import { API_BASE_URL } from "@/lib/api";

/** Backend origin without `/api/v1` (e.g. `http://localhost:3662`). */
export const MEDIA_ORIGIN = API_BASE_URL.replace(/\/api\/v\d+$/, "");

/**
 * Normalise wallpaper/media URLs from the API to paths the frontend can load.
 *
 * User uploads are stored as absolute URLs (localhost or halalwalls.com) but
 * should be served via the frontend `/uploads/*` rewrite → backend static files.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  const raw = url.trim();
  if (!raw) return "";

  if (raw.startsWith("/uploads/")) return raw;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const pathname = new URL(raw).pathname;
      if (pathname.startsWith("/uploads/")) return pathname;
    } catch {
      /* fall through */
    }
    return raw;
  }

  if (raw.startsWith("/")) return raw;
  return raw;
}

/** Bypass next/image optimizer for backend-served uploads (avoids private-IP block). */
export function shouldUnoptimizeMedia(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("data:")) return true;
  if (url.startsWith("/uploads/")) return true;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "::1") return true;
    if (parsed.pathname.startsWith("/uploads/")) return true;
    // Google OAuth avatars (and similar CDNs) often fail through the optimizer.
    if (host === "lh3.googleusercontent.com" || host.endsWith(".googleusercontent.com")) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Prefer a larger Google profile photo when the OAuth URL is size-capped
 * (e.g. `=s96-c` → `=s512-c`) so the profile avatar stays sharp.
 */
export function upgradeAvatarUrl(url: string | null | undefined, size = 512): string {
  if (!url) return "";
  const raw = url.trim();
  if (!raw) return "";

  try {
    const parsed = new URL(raw);
    if (
      parsed.hostname === "lh3.googleusercontent.com" ||
      parsed.hostname.endsWith(".googleusercontent.com")
    ) {
      // Common shapes: .../photo.jpg=s96-c  or  ...=s96-c-mo
      const upgraded = raw.replace(/=s\d+(-[a-z]+)*$/i, `=s${size}-c`);
      if (upgraded !== raw) return upgraded;
      if (!/=s\d+/i.test(raw)) return `${raw}=s${size}-c`;
    }
  } catch {
    /* keep original */
  }

  return raw;
}
