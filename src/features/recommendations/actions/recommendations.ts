"use server";

import { and, desc, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/drizzle";
import {
  recommendationsInsertSchema,
  type RecommendationsFormValues,
} from "@/db/schema/recommendations.schema";
import { TbRecommendations } from "@/db/table";
import { withAuthAction } from "@/lib/auth/middleware";

export const getRecommendations = withAuthAction(async (auth) => {
  if (!auth.profile) return [];
  return db.query.TbRecommendations.findMany({
    where: and(
      eq(TbRecommendations.profileId, auth.profile.id),
      isNull(TbRecommendations.deletedAt)
    ),
    orderBy: [desc(TbRecommendations.createdAt)],
  });
});

export const createRecommendationAction = withAuthAction(
  async (auth, data: RecommendationsFormValues) => {
    try {
      if (!auth.profile) {
        throw new Error("Profile not found. Please create a profile first.");
      }

      const validated = recommendationsInsertSchema.safeParse({
        ...data,
        profileId: auth.profile.id,
      });
      if (!validated.success) {
        throw new Error("Invalid recommendation data");
      }

      const [created] = await db
        .insert(TbRecommendations)
        .values(validated.data)
        .returning();

      revalidatePath("/dashboard/recommendations");
      revalidatePath("/");

      return {
        success: true as const,
        data: created,
        message: "Recommendation added successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false as const, error: error.message };
      }
      return {
        success: false as const,
        error: "Failed to add recommendation",
      };
    }
  }
);

export const updateRecommendationAction = withAuthAction(
  async (auth, id: string, data: RecommendationsFormValues) => {
    try {
      if (!auth.profile) {
        throw new Error("Profile not found.");
      }

      const validated = recommendationsInsertSchema.safeParse({
        ...data,
        profileId: auth.profile.id,
      });
      if (!validated.success) {
        throw new Error("Invalid recommendation data");
      }

      const existing = await db.query.TbRecommendations.findFirst({
        where: and(
          eq(TbRecommendations.id, id),
          eq(TbRecommendations.profileId, auth.profile.id)
        ),
      });
      if (!existing) {
        throw new Error("Recommendation not found");
      }

      const [updated] = await db
        .update(TbRecommendations)
        .set(validated.data)
        .where(
          and(eq(TbRecommendations.id, id), eq(TbRecommendations.profileId, auth.profile.id))
        )
        .returning();

      revalidatePath("/dashboard/recommendations");
      revalidatePath("/");

      return {
        success: true as const,
        data: updated,
        message: "Recommendation updated successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false as const, error: error.message };
      }
      return {
        success: false as const,
        error: "Failed to update recommendation",
      };
    }
  }
);

export const deleteRecommendationAction = withAuthAction(
  async (auth, id: string) => {
    try {
      if (!auth.profile) {
        throw new Error("Profile not found.");
      }

      const existing = await db.query.TbRecommendations.findFirst({
        where: and(
          eq(TbRecommendations.id, id),
          eq(TbRecommendations.profileId, auth.profile.id)
        ),
      });
      if (!existing) {
        throw new Error("Recommendation not found");
      }

      await db
        .update(TbRecommendations)
        .set({ deletedAt: new Date() })
        .where(and(eq(TbRecommendations.id, id), eq(TbRecommendations.profileId, auth.profile.id)));

      revalidatePath("/dashboard/recommendations");
      revalidatePath("/");

      return { success: true as const, message: "Recommendation deleted" };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false as const, error: error.message };
      }
      return {
        success: false as const,
        error: "Failed to delete recommendation",
      };
    }
  }
);
