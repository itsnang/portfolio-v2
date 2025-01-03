"use server";
import { db, takeFirstOrThrow } from "@/db/drizzle";

export const getProfile = async () => {
  try {
    const data = await db.query.TbProfile.findMany({
      with: {
        skills: true,
        experience: {
          where: (experience, { eq }) => eq(experience.isActive, true),
          orderBy: (experience, { desc }) => [desc(experience.startDate)],
        },
        education: {
          where: (education, { eq }) => eq(education.isActive, true),
          orderBy: (education, { asc }) => [asc(education.startDate)],
        },
        projects: {
          where: (project, { eq }) => eq(project.isActive, true),
          orderBy: (project, { desc }) => [desc(project.createdAt)],
        },
        socials: {
          where: (social, { eq }) => eq(social.isActive, true),
        },
      },
    }).then(takeFirstOrThrow);
    return data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw new Error("Failed to fetch profile data");
  }
};
