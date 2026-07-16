import type { NextConfig } from "next";

/**
 * Where Next should proxy `/uploads/*` (server-side rewrite destination).
 *
 * Must be an *internal* backend URL in production (e.g. http://127.0.0.1:3662).
 * Using https://halalwalls.com here causes a Cloudflare loop
 * (Error 1000 “DNS points to prohibited IP” → browser 403 on images).
 */
function resolveMediaOrigin(): string {
  const explicit = process.env.MEDIA_ORIGIN?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3662/api/v1";
  const fromApi = apiUrl.replace(/\/api\/v\d+$/, "").replace(/\/$/, "");

  try {
    const host = new URL(fromApi).hostname;
    if (host === "halalwalls.com" || host === "www.halalwalls.com") {
      return "http://127.0.0.1:3662";
    }
  } catch {
    /* fall through */
  }

  return fromApi || "http://localhost:3662";
}

const mediaOrigin = resolveMediaOrigin();

const nextConfig: NextConfig = {
  // Hide the Next.js dev-tools badge (it floats bottom-left and overlaps the
  // mobile bottom nav's Home icon during local review).
  devIndicators: false,
  async rewrites() {
    // Proxy user-uploaded files through the frontend origin so next/image and
    // the browser never need to hit the backend host directly.
    return [
      {
        source: "/uploads/:path*",
        destination: `${mediaOrigin}/uploads/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      // Backend-served media (local dev fallback + future production media host).
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "halalwalls.com" }, // apex (user-upload URLs use this)
      { protocol: "https", hostname: "**.halalwalls.com" }, // + any subdomain (www, cdn, …)
    ],
  },
};

export default nextConfig;
