import type { NextConfig } from "next";

// Next loads .env files before this config, so the Blog Site's address is
// available here. Validated in src/utils/env.ts too, but redirects run first.
const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL;
if (!blogUrl) throw new Error("NEXT_PUBLIC_BLOG_URL must be set: /blog redirects to it.");
const blogOrigin = blogUrl.replace(/\/$/, "");

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
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Load sharp from node_modules instead of bundling it. Bundled, it resolves
  // to the @img/sharp-wasm32 build, which has no SVG rasterizer — that makes
  // next/og's SVG->PNG step fail with "Input buffer contains unsupported
  // image format" when generating opengraph images.
  serverExternalPackages: ["sharp"],
  // The blog moved to the Blog Site. Temporary for now; step 9 of the site
  // split makes them permanent once the Blog Site has proven itself.
  async redirects() {
    return [
      { source: "/blog", destination: `${blogOrigin}/`, permanent: false },
      { source: "/blog/:path*", destination: `${blogOrigin}/:path*`, permanent: false },
    ];
  },
};

export default nextConfig;
