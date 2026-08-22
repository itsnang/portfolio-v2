"use server";
import { db, takeFirstOrThrow } from "@/db/drizzle";
import { err, ok } from "@justmiracle/result";

export const getProfile = async () => {
  try {
    const data = await db.query.TbProfile.findMany({
      with: {
        skills: {
          where: (skill, { eq, and, isNull }) => and(eq(skill.isActive, true), isNull(skill.deletedAt)),
        },
        experience: {
          where: (experience, { eq }) => eq(experience.isActive, true),
          orderBy: (experience, { asc }) => [asc(experience.sortOrder)],
        },
        education: {
          where: (education, { eq, and, isNull }) =>
            and(eq(education.isActive, true), isNull(education.deletedAt)),
          orderBy: (education, { asc }) => [asc(education.startDate)],
        },
        projects: {
          where: (project, { eq }) => eq(project.isActive, true),
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
    }).then(takeFirstOrThrow);
    return data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw new Error("Failed to fetch profile data");
  }
};

export const getSocials = async () => {
  const socials = await db.query.TbSocials.findMany({
    where: (social, { eq, and, isNull }) => and(eq(social.isActive, true), isNull(social.deletedAt)),
  })
    .then(ok)
    .catch(err);
  if (socials.error) {
    throw new Error("Failed to fetch socials data");
  }
  console.log(socials.value);
  return socials.value;
};
