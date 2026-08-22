"use server";
import { db, takeFirstOrThrow } from "@/db/drizzle";
import { ProfileInsert, profileInsertSchema } from "@/db/schema/profile.schema";
import { TbProfile } from "@/db/table";
import { eq } from "drizzle-orm";
import { withAuthAction } from "@/lib/auth/middleware";

/** Public, unauthenticated read used by the public site — the whole profile aggregate. */
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

export const updateProfileAction = withAuthAction(
  async (auth, profile: ProfileInsert) => {
    try {
      const isValidate = profileInsertSchema.safeParse(profile);
      if (!isValidate.success) {
        throw new Error("Invalid profile data");
      }
      await db
        .update(TbProfile)
        .set(profile)
        .where(eq(TbProfile.userId, auth.user.id))
        .returning();
      const profileData = await db.query.TbProfile.findFirst({
        where: eq(TbProfile.userId, auth.user.id),
      });
      return {
        success: true,
        data: profileData,
        message: "Profile updated successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Failed to create showcase" };
    }
  }
);
