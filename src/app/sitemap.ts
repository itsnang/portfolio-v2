import { MetadataRoute } from "next";
import { getProfile } from "@/features/profile/actions";
import { getPublishedBlogPosts } from "@/features/blog/actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lornsamnang.com";

  // Static routes with high priority
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/achievement`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic project routes
  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const profile = await getProfile();

    projectRoutes = profile.projects
      .filter((project) => project.isActive)
      .map((project) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: project.updatedAt || project.createdAt,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      }));
  } catch (error) {
    console.error("Error fetching projects for sitemap:", error);
    // Return static routes even if dynamic routes fail
  }

  // Dynamic blog post routes
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const posts = await getPublishedBlogPosts();

    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || post.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
    // Return static + project routes even if blog routes fail
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
