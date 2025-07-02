import { MetadataRoute } from "next";
import { getProfile } from "./action";

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

  return [...staticRoutes, ...projectRoutes];
}
