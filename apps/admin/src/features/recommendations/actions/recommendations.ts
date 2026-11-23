"use server";

import { and, eq, isNull } from "drizzle-orm";
import { recommendationsInsertSchema, type RecommendationsFormValues, TbRecommendations } from "@portfolio/db/schema";

import { db } from "@/db/drizzle";
import { ActionError, adminAction, parseInput } from "@/lib/admin-action";

const dashboardPath = "/dashboard/recommendations";
// Recommendations appear on the home page only.
const refresh = { resource: "profile" } as const;

const ownRecommendation = (id: string, profileId: string) =>
  and(eq(TbRecommendations.id, id), eq(TbRecommendations.profileId, profileId), isNull(TbRecommendations.deletedAt));

export const createRecommendationAction = adminAction(
  "Failed to add recommendation",
  async ({ profile }, input: RecommendationsFormValues) => {
    const values = parseInput(recommendationsInsertSchema, { ...input, profileId: profile.id }, "Invalid recommendation data");
    const [created] = await db.insert(TbRecommendations).values(values).returning();
    return { data: created, message: "Recommendation added successfully", dashboardPath, refresh };
  }
);

export const updateRecommendationAction = adminAction(
  "Failed to update recommendation",
  async ({ profile }, id: string, input: RecommendationsFormValues) => {
    const values = parseInput(recommendationsInsertSchema, { ...input, profileId: profile.id }, "Invalid recommendation data");
    const [updated] = await db.update(TbRecommendations).set(values).where(ownRecommendation(id, profile.id)).returning();
    if (!updated) throw new ActionError("Recommendation not found");
    return { data: updated, message: "Recommendation updated successfully", dashboardPath, refresh };
  }
);

export const deleteRecommendationAction = adminAction("Failed to delete recommendation", async ({ profile }, id: string) => {
  const [deleted] = await db
    .update(TbRecommendations)
    .set({ deletedAt: new Date() })
    .where(ownRecommendation(id, profile.id))
    .returning({ id: TbRecommendations.id });
  if (!deleted) throw new ActionError("Recommendation not found");
  return { data: undefined, message: "Recommendation deleted", dashboardPath, refresh };
});
