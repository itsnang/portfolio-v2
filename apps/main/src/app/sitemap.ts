import { MetadataRoute } from "next";
import { getProfile } from "@/features/profile/queries";
import { mainPageUrl, mainUrl } from "@/lib/site-urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes with high priority
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: mainUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: mainPageUrl("/achievement"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic project routes
  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const profile = await getProfile();

    projectRoutes = profile.projects
      .filter((project) => project.isActive)
      .map((project) => ({
        url: mainPageUrl(`/projects/${project.id}`),
        lastModified: project.updatedAt || project.createdAt,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      }));
  } catch (error) {
    console.error("Error fetching projects for sitemap:", error);
    // Return static routes even if dynamic routes fail
  }

  // Posts are in the Blog Site's own sitemap.
  return [...staticRoutes, ...projectRoutes];
}
