"use server";

import { and, eq, isNull } from "drizzle-orm";
import { educationInsertSchema, type EducationFormValues, TbEducation } from "@portfolio/db/schema";

import { db } from "@/db/drizzle";
import { ActionError, adminAction, parseInput } from "@/lib/admin-action";

const dashboardPath = "/dashboard/education";
// Education appears on the home page only.
const refresh = { resource: "profile" } as const;

const ownEducation = (id: string, profileId: string) =>
  and(eq(TbEducation.id, id), eq(TbEducation.userId, profileId), isNull(TbEducation.deletedAt));

export const createEducationAction = adminAction(
  "Failed to add education",
  async ({ profile }, input: EducationFormValues) => {
    const values = parseInput(educationInsertSchema, { ...input, userId: profile.id }, "Invalid education data");
    const [created] = await db.insert(TbEducation).values(values).returning();
    return { data: created, message: "Education added successfully", dashboardPath, refresh };
  }
);

export const updateEducationAction = adminAction(
  "Failed to update education",
  async ({ profile }, id: string, input: EducationFormValues) => {
    const values = parseInput(educationInsertSchema, { ...input, userId: profile.id }, "Invalid education data");
    const [updated] = await db.update(TbEducation).set(values).where(ownEducation(id, profile.id)).returning();
    if (!updated) throw new ActionError("Education entry not found");
    return { data: updated, message: "Education updated successfully", dashboardPath, refresh };
  }
);

export const deleteEducationAction = adminAction("Failed to delete education", async ({ profile }, id: string) => {
  const [deleted] = await db
    .update(TbEducation)
    .set({ deletedAt: new Date() })
    .where(ownEducation(id, profile.id))
    .returning({ id: TbEducation.id });
  if (!deleted) throw new ActionError("Education entry not found");
  return { data: undefined, message: "Education deleted", dashboardPath, refresh };
});
