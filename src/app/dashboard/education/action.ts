"use server";

import { and, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/db/drizzle";
import {
  educationInsertSchema,
  type EducationFormValues,
} from "@/db/schema/education.schema";
import { TbEducation } from "@/db/table";
import { withAuthAction } from "@/server/actions/middleware";

export const getEducations = withAuthAction(async (auth) => {
  if (!auth.profile) return [];
  return db.query.TbEducation.findMany({
    where: and(
      eq(TbEducation.userId, auth.profile.id),
      isNull(TbEducation.deletedAt)
    ),
    orderBy: [desc(TbEducation.startDate)],
  });
});

export const createEducationAction = withAuthAction(
  async (auth, education: EducationFormValues) => {
    try {
      if (!auth.profile) {
        throw new Error("Profile not found. Please create a profile first.");
      }

      const validated = educationInsertSchema.safeParse({
        ...education,
        userId: auth.profile.id,
      });
      if (!validated.success) {
        throw new Error("Invalid education data");
      }

      const [created] = await db
        .insert(TbEducation)
        .values(validated.data)
        .returning();

      return {
        success: true as const,
        data: created,
        message: "Education added successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false as const, error: error.message };
      }
      return { success: false as const, error: "Failed to add education" };
    }
  }
);

export const updateEducationAction = withAuthAction(
  async (auth, id: string, education: EducationFormValues) => {
    try {
      if (!auth.profile) {
        throw new Error("Profile not found.");
      }

      const validated = educationInsertSchema.safeParse({
        ...education,
        userId: auth.profile.id,
      });
      if (!validated.success) {
        throw new Error("Invalid education data");
      }

      const existing = await db.query.TbEducation.findFirst({
        where: and(
          eq(TbEducation.id, id),
          eq(TbEducation.userId, auth.profile.id)
        ),
      });
      if (!existing) {
        throw new Error("Education entry not found");
      }

      const [updated] = await db
        .update(TbEducation)
        .set(validated.data)
        .where(eq(TbEducation.id, id))
        .returning();

      return {
        success: true as const,
        data: updated,
        message: "Education updated successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false as const, error: error.message };
      }
      return { success: false as const, error: "Failed to update education" };
    }
  }
);

export const deleteEducationAction = withAuthAction(
  async (auth, id: string) => {
    try {
      if (!auth.profile) {
        throw new Error("Profile not found.");
      }

      const existing = await db.query.TbEducation.findFirst({
        where: and(
          eq(TbEducation.id, id),
          eq(TbEducation.userId, auth.profile.id)
        ),
      });
      if (!existing) {
        throw new Error("Education entry not found");
      }

      await db
        .update(TbEducation)
        .set({ deletedAt: new Date() })
        .where(eq(TbEducation.id, id));

      return { success: true as const, message: "Education deleted" };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false as const, error: error.message };
      }
      return { success: false as const, error: "Failed to delete education" };
    }
  }
);
