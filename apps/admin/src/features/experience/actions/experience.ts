"use server";

import { and, eq, isNull } from "drizzle-orm";
import { type ExperiencesInsert, experiencesInsertSchema, TbExperiences } from "@portfolio/db/schema";

import { db } from "@/db/drizzle";
import { ActionError, adminAction, parseInput } from "@/lib/admin-action";

const dashboardPath = "/dashboard/experience";
// Experience appears on the home page only.
const refresh = { resource: "profile" } as const;

export const createExperienceAction = adminAction(
  "Failed to add experience",
  async ({ profile }, experience: ExperiencesInsert) => {
    const values = parseInput(
      experiencesInsertSchema,
      { ...experience, userId: profile.id },
      "Invalid experience data"
    );
    const [created] = await db.insert(TbExperiences).values(values).returning({ id: TbExperiences.id });
    return { data: created, message: "Experience added successfully", dashboardPath, refresh };
  }
);

export const updateExperienceAction = adminAction(
  "Failed to update experience",
  async ({ profile }, id: string, experience: ExperiencesInsert) => {
    const values = parseInput(
      experiencesInsertSchema,
      { ...experience, userId: profile.id },
      "Invalid experience data"
    );
    const [updated] = await db
      .update(TbExperiences)
      .set({ ...values, updatedAt: new Date() })
      .where(
        and(eq(TbExperiences.id, id), eq(TbExperiences.userId, profile.id), isNull(TbExperiences.deletedAt))
      )
      .returning({ id: TbExperiences.id });
    if (!updated) throw new ActionError("Experience not found");
    return { data: updated, message: "Experience updated successfully", dashboardPath, refresh };
  }
);
