import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TbRecommendations } from "../table/recommendations.table";
import { z } from "zod";

export const recommendationsSchema = createSelectSchema(TbRecommendations);

export const recommendationsInsertSchema = createInsertSchema(
  TbRecommendations,
  {
    profileId: z.string(),
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    position: z.string().min(1, "Position is required"),
    profileImageUrl: z.string().url("Invalid profile image URL"),
    recommendationText: z
      .string()
      .min(10, "Recommendation must be at least 10 characters")
      .max(1000, "Recommendation too long"),
    isActive: z.boolean().default(true),
  }
);

export type Recommendations = z.infer<typeof recommendationsSchema>;
export type RecommendationsInsert = z.infer<typeof recommendationsInsertSchema>;
