import type { NextConfig } from "next";

// Not a PWA: unlike the Main Site, there's no withPWA wrapper here.
const nextConfig: NextConfig = {
  experimental: {
    // Vercel restores .next/cache before every build, and a restored Turbopack
    // cache once shipped a stale stylesheet (the Admin Site redesign deployed
    // without its colours). Build fresh; dev keeps its cache.
    turbopackFileSystemCacheForBuild: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000, // 1 year
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Load sharp from node_modules instead of bundling it. Bundled, it resolves
  // to the @img/sharp-wasm32 build, which has no SVG rasterizer — that makes
  // next/og's SVG->PNG step fail when generating opengraph images.
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
