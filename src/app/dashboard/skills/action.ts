"use server";

import { and, desc, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/drizzle";
import {
  skillsInsertSchema,
  type SkillsFormValues,
} from "@/db/schema/skills.schma";
import { TbSkills } from "@/db/table";
import { withAuthAction } from "@/server/actions/middleware";

export const getSkills = withAuthAction(async (auth) => {
  if (!auth.profile) return [];
  return db.query.TbSkills.findMany({
    where: and(
      eq(TbSkills.userId, auth.profile.id),
      isNull(TbSkills.deletedAt)
    ),
    orderBy: [desc(TbSkills.createdAt)],
  });
});

export const createSkillAction = withAuthAction(
  async (auth, skill: SkillsFormValues) => {
    try {
      if (!auth.profile) {
        throw new Error("Profile not found. Please create a profile first.");
      }

      const validated = skillsInsertSchema.safeParse({
        ...skill,
        userId: auth.profile.id,
      });
      if (!validated.success) {
        throw new Error("Invalid skill data");
      }

      const [created] = await db
        .insert(TbSkills)
        .values(validated.data)
        .returning();

      revalidatePath("/dashboard/skills");
      revalidatePath("/");

      return {
        success: true as const,
        data: created,
        message: "Skill added successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false as const, error: error.message };
      }
      return { success: false as const, error: "Failed to add skill" };
    }
  }
);

export const updateSkillAction = withAuthAction(
  async (auth, id: string, skill: SkillsFormValues) => {
    try {
      if (!auth.profile) {
        throw new Error("Profile not found.");
      }

      const validated = skillsInsertSchema.safeParse({
        ...skill,
        userId: auth.profile.id,
      });
      if (!validated.success) {
        throw new Error("Invalid skill data");
      }

      const existing = await db.query.TbSkills.findFirst({
        where: and(eq(TbSkills.id, id), eq(TbSkills.userId, auth.profile.id)),
      });
      if (!existing) {
        throw new Error("Skill not found");
      }

      const [updated] = await db
        .update(TbSkills)
        .set(validated.data)
        .where(
          and(eq(TbSkills.id, id), eq(TbSkills.userId, auth.profile.id))
        )
        .returning();

      revalidatePath("/dashboard/skills");
      revalidatePath("/");

      return {
        success: true as const,
        data: updated,
        message: "Skill updated successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false as const, error: error.message };
      }
      return { success: false as const, error: "Failed to update skill" };
    }
  }
);

export const deleteSkillAction = withAuthAction(async (auth, id: string) => {
  try {
    if (!auth.profile) {
      throw new Error("Profile not found.");
    }

    const existing = await db.query.TbSkills.findFirst({
      where: and(eq(TbSkills.id, id), eq(TbSkills.userId, auth.profile.id)),
    });
    if (!existing) {
      throw new Error("Skill not found");
    }

    await db
      .update(TbSkills)
      .set({ deletedAt: new Date() })
      .where(and(eq(TbSkills.id, id), eq(TbSkills.userId, auth.profile.id)));

    revalidatePath("/dashboard/skills");
    revalidatePath("/");

    return { success: true as const, message: "Skill deleted" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Failed to delete skill" };
  }
});
