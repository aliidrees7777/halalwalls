import type { ReadonlyURLSearchParams } from "next/navigation";

/**
 * Extract a clean "WIDTHxHEIGHT" from a resolution label like "3840×2160 (4K)"
 * → "3840x2160" (so it matches the wallpaper's stored native resolution).
 */
export function normalizeResolution(label: string): string {
  const m = label.match(/(\d+)\s*[×x]\s*(\d+)/);
  return m ? `${m[1]}x${m[2]}` : label.replace(/×/g, "x").trim();
}

/**
 * Merge filter updates into the current query and target the homepage, so every
 * filter (category, sort, tag, resolution, q) STACKS instead of replacing.
 * Pass a value of null/"" to remove that key.
 */
export function buildFilterHref(
  searchParams: ReadonlyURLSearchParams | URLSearchParams,
  updates: Record<string, string | null>
): string {
  const params = new URLSearchParams(searchParams.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (!value) params.delete(key);
    else params.set(key, value);
  }
  params.delete("page"); // back to page 1 on any filter change
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}
