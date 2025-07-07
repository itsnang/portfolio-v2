"use server";

import { db } from "@/db/drizzle";
import { TbRecommendations } from "@/db/table";
import { RecommendationsInsert } from "@/db/schema/recommendations.schema";
import { revalidatePath } from "next/cache";

export const insertRecommendation = async (data: RecommendationsInsert) => {
  try {
    await db.insert(TbRecommendations).values(data);
    revalidatePath("/dashboard/recommendations");
    revalidatePath("/");
  } catch (error) {
    console.error("Error inserting recommendation:", error);
    throw new Error("Failed to insert recommendation");
  }
};

export const getRecommendations = async () => {
  try {
    const recommendations = await db.query.TbRecommendations.findMany({
      orderBy: (recommendation, { desc }) => [desc(recommendation.createdAt)],
    });
    return recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw new Error("Failed to fetch recommendations");
  }
};
