import "server-only";

import { db } from "@/db/drizzle";
import { requireAuth } from "@/lib/auth/get-current-user";

export const getProjects = async () => {
  await requireAuth();
  try {
    const projects = await db.query.TbProject.findMany({
      orderBy: (project, { asc, desc }) => [
        asc(project.sortOrder),
        desc(project.createdAt),
      ],
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
};
