import { MetadataRoute } from "next";
import { mainPageUrl, mainUrl } from "@/lib/site-urls";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: mainPageUrl("/sitemap.xml"),
    host: mainUrl,
  };
}
