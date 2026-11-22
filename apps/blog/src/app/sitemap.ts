import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/queries";
import { blogPageUrl, postUrl } from "@/lib/metadata";

// Same timer as the pages; a Post save also refreshes it (see /api/revalidate).
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedBlogPosts();

  return [
    {
      url: blogPageUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...posts.map((post) => ({
      url: postUrl(post.slug),
      lastModified: post.updatedAt || post.publishedAt || post.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
