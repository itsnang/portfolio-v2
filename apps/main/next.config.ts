import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
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
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Load sharp from node_modules instead of bundling it. Bundled, it resolves
  // to the @img/sharp-wasm32 build, which has no SVG rasterizer — that makes
  // next/og's SVG->PNG step fail with "Input buffer contains unsupported
  // image format" when generating opengraph images.
  serverExternalPackages: ["sharp"],
  experimental: {
    serverActions: {
      // Next's default is 1MB, which silently rejects most real photos before
      // they ever reach Cloudinary — image uploads go through uploadStagedFile
      // as a Server Action, so this must comfortably clear MAX_FILE_SIZE
      // (features/media/constants.ts).
      bodySizeLimit: "8mb",
    },
  },
};

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);

export default pwaConfig;
