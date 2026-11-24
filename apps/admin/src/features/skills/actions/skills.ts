"use server";

import { and, eq, isNull } from "drizzle-orm";
import { skillsInsertSchema, type SkillsFormValues, TbSkills } from "@portfolio/db/schema";

import { db } from "@/db/drizzle";
import { ActionError, adminAction, parseInput } from "@/lib/admin-action";

const dashboardPath = "/dashboard/skills";
// Skills appear on the home page only.
const refresh = { resource: "profile" } as const;

const ownSkill = (id: string, profileId: string) =>
  and(eq(TbSkills.id, id), eq(TbSkills.userId, profileId), isNull(TbSkills.deletedAt));

export const createSkillAction = adminAction(
  "Failed to add skill",
  async ({ profile }, skill: SkillsFormValues) => {
    const values = parseInput(skillsInsertSchema, { ...skill, userId: profile.id }, "Invalid skill data");
    const [created] = await db.insert(TbSkills).values(values).returning();
    return { data: created, message: "Skill added successfully", dashboardPath, refresh };
  }
);

export const updateSkillAction = adminAction(
  "Failed to update skill",
  async ({ profile }, id: string, skill: SkillsFormValues) => {
    const values = parseInput(skillsInsertSchema, { ...skill, userId: profile.id }, "Invalid skill data");
    const [updated] = await db.update(TbSkills).set(values).where(ownSkill(id, profile.id)).returning();
    if (!updated) throw new ActionError("Skill not found");
    return { data: updated, message: "Skill updated successfully", dashboardPath, refresh };
  }
);

export const deleteSkillAction = adminAction("Failed to delete skill", async ({ profile }, id: string) => {
  const [deleted] = await db
    .update(TbSkills)
    .set({ deletedAt: new Date() })
    .where(ownSkill(id, profile.id))
    .returning({ id: TbSkills.id });
  if (!deleted) throw new ActionError("Skill not found");
  return { data: undefined, message: "Skill deleted", dashboardPath, refresh };
});
