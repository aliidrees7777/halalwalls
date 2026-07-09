import type { NextConfig } from "next";

const mediaOrigin = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3662/api/v1"
).replace(/\/api\/v\d+$/, "");

const nextConfig: NextConfig = {
  // Hide the Next.js dev-tools badge (it floats bottom-left and overlaps the
  // mobile bottom nav's Home icon during local review).
  devIndicators: false,
  async rewrites() {
    // Proxy user-uploaded files through the frontend origin so next/image and
    // the browser never need to hit localhost:3662 directly.
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
      { protocol: "https", hostname: "halalwalls.com" }, // apex (user-upload URLs use this)
      { protocol: "https", hostname: "**.halalwalls.com" }, // + any subdomain (www, cdn, …)
    ],
  },
};

export default nextConfig;
