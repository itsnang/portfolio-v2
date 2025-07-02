import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/sign-in/",
        "/sign-out/",
        "/api/",
        "/_next/",
        "/_vercel/",
        "/admin/",
      ],
    },
    sitemap: "https://lornsamnang.com/sitemap.xml",
    host: "https://lornsamnang.com",
  };
}
