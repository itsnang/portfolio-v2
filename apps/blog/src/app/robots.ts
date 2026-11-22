import type { MetadataRoute } from "next";
import { blogPageUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: blogPageUrl("/sitemap.xml"),
  };
}
