/**
 * Extract a social username from a credit / source URL for display.
 * Mirrors backend/src/helpers/source-url.js.
 */
const PATH_RESERVED = new Set([
  "p",
  "reel",
  "reels",
  "stories",
  "tv",
  "status",
  "watch",
  "channel",
  "c",
  "user",
  "users",
  "explore",
  "tags",
  "share",
  "video",
  "photos",
  "about",
  "home",
  "login",
  "signup",
  "in",
]);

export function parseSourceUrl(input: string | null | undefined): {
  url: string;
  username: string | null;
} {
  const raw = String(input || "").trim();
  if (!raw) return { url: "", username: null };

  let url: URL;
  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    url = new URL(withProto);
  } catch {
    return { url: raw, username: null };
  }

  const href = url.href;
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length === 0) return { url: href, username: null };

  if (
    url.hostname.includes("linkedin.com") &&
    parts[0]?.toLowerCase() === "in" &&
    parts[1]
  ) {
    return {
      url: href,
      username: decodeURIComponent(parts[1].replace(/^@/, "")),
    };
  }

  const first = decodeURIComponent(parts[0].replace(/^@/, ""));
  if (!first || PATH_RESERVED.has(first.toLowerCase())) {
    return { url: href, username: null };
  }

  return { url: href, username: first };
}

export function isHttpUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const u = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
