import { getToken } from "@/lib/api";

/**
 * Best-effort bust of the Next.js wallpaper ISR cache after admin mutations.
 * Failures are swallowed so moderation never breaks if revalidate is down.
 */
export async function bustWallpaperPageCache(slug?: string | null) {
  if (typeof window === "undefined") return;

  const token = getToken();
  if (!token) return;

  try {
    await fetch("/api/revalidate/wallpaper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(slug ? { slug } : {}),
    });
  } catch {
    // non-fatal
  }
}
