import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: "https://lornsamnang.com/sitemap.xml",
    host: "https://lornsamnang.com",
  };
}
