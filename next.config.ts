import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev-tools badge (it floats bottom-left and overlaps the
  // mobile bottom nav's Home icon during local review).
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      // Backend-served media (local dev fallback + future production media host).
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**.halalwalls.com" },
    ],
  },
};

export default nextConfig;
