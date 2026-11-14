"use server";

import { db } from "@/db/drizzle";
import { ExperiencesInsert, experiencesInsertSchema, TbExperiences } from "@portfolio/db/schema";
import { withAuthAction } from "@/lib/auth/middleware";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const insertExperiences = withAuthAction(
  async (auth, experience: ExperiencesInsert) => {
    if (!auth.profile) {
      return {
        success: false as const,
        error: "Profile not found. Please create a profile first.",
      };
    }

    const validated = experiencesInsertSchema.safeParse({
      ...experience,
      userId: auth.profile.id,
    });
    if (!validated.success) {
      return { success: false as const, error: "Invalid experience data" };
    }

    try {
      const [created] = await db
        .insert(TbExperiences)
        .values(validated.data)
        .returning({ id: TbExperiences.id });

      revalidatePath("/dashboard/experience");
      revalidatePath("/");

      return {
        success: true as const,
        data: created,
        message: "Experience added successfully",
      };
    } catch (error) {
      console.error("Error inserting experience:", error);
      return { success: false as const, error: "Failed to add experience" };
    }
  }
);

export const updateExperience = withAuthAction(
  async (auth, id: string, experience: ExperiencesInsert) => {
    if (!auth.profile) {
      return { success: false as const, error: "Profile not found." };
    }

    const validated = experiencesInsertSchema.safeParse({
      ...experience,
      userId: auth.profile.id,
    });
    if (!validated.success) {
      return { success: false as const, error: "Invalid experience data" };
    }

    try {
      const [updated] = await db
        .update(TbExperiences)
        .set({
          ...validated.data,
          updatedAt: new Date(),
        })
        .where(eq(TbExperiences.id, id))
        .returning({ id: TbExperiences.id });

      if (!updated) {
        return { success: false as const, error: "Experience not found" };
      }

      revalidatePath("/dashboard/experience");
      revalidatePath("/");

      return {
        success: true as const,
        data: updated,
        message: "Experience updated successfully",
      };
    } catch (error) {
      console.error("Error updating experience:", error);
      return { success: false as const, error: "Failed to update experience" };
    }
  }
);
