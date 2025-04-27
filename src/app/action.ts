"use server";
import { db, takeFirstOrThrow } from "@/db/drizzle";
import { err, ok } from "@justmiracle/result";

export const getProfile = async () => {
  try {
    const data = await db.query.TbProfile.findMany({
      with: {
        skills: true,
        experience: {
          where: (experience, { eq }) => eq(experience.isActive, true),
          orderBy: (experience, { desc }) => [desc(experience.endDate)],
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

export const getSocials = async () => {
  const socials = await db.query.TbSocials.findMany({
    where: (social, { eq }) => eq(social.isActive, true),
  })
    .then(ok)
    .catch(err);
  if (socials.error) {
    throw new Error("Failed to fetch socials data");
  }
  console.log(socials.value);
  return socials.value;
};
