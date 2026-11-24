import "server-only";

import { cache } from "react";
import { db } from "@/db/drizzle";

/**
 * Public read of the whole profile aggregate. Cached per request, since the
 * layout metadata, the page and the sitemap all ask for it.
 */
export const getProfile = cache(async () => {
  try {
    const data = await db.query.TbProfile.findFirst({
      with: {
        skills: {
          where: (skill, { eq, and, isNull }) => and(eq(skill.isActive, true), isNull(skill.deletedAt)),
        },
        experience: {
          where: (experience, { eq, and, isNull }) =>
            and(eq(experience.isActive, true), isNull(experience.deletedAt)),
          orderBy: (experience, { asc }) => [asc(experience.sortOrder)],
        },
        education: {
          where: (education, { eq, and, isNull }) =>
            and(eq(education.isActive, true), isNull(education.deletedAt)),
          orderBy: (education, { asc }) => [asc(education.startDate)],
        },
        projects: {
          where: (project, { eq, and, isNull }) => and(eq(project.isActive, true), isNull(project.deletedAt)),
          orderBy: (project, { desc }) => [desc(project.createdAt)],
        },
        socials: {
          where: (social, { eq, and, isNull }) => and(eq(social.isActive, true), isNull(social.deletedAt)),
        },
        recommendations: {
          where: (recommendation, { eq, and, isNull }) =>
            and(eq(recommendation.isActive, true), isNull(recommendation.deletedAt)),
          orderBy: (recommendation, { asc }) => [asc(recommendation.createdAt)],
        },
      },
    });
    if (!data) throw new Error("No profile found");
    return data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw new Error("Failed to fetch profile data");
  }
});
