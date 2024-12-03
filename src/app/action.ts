"use server";
import { db, takeFirstOrThrow } from "@/db/drizzle";

export const getProfile = async () => {
  try {
    const data = await db.query.TbProfile.findMany({
      with: {
        skills: true,
        experience: {
          where: (experience, { eq }) => eq(experience.isActive, true),
        },
        education: {
          where: (education, { eq }) => eq(education.isActive, true),
        },
        projects: {
          where: (project, { eq }) => eq(project.isActive, true),
        },
      },
    }).then(takeFirstOrThrow);

    return data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw new Error("Failed to fetch profile data");
  }
};
