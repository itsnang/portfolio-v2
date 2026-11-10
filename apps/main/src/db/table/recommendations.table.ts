import { table, column } from "@/utils";
import { relations } from "drizzle-orm";
import { TbProfile } from "./profile.table";
import { genId } from "@/utils/id";

export type TbRecommendations = typeof TbRecommendations;

export const TbRecommendations = table("recommendations", {
  id: column.id.$default(genId("recommendation")),
  profileId: column.text("profile_id").references(() => TbProfile.id),
  isActive: column.boolean("is_active").default(true),
  name: column.text("name").notNull(),
  position: column.text("position").notNull(),
  profileImageUrl: column.text("profile_image_url").notNull(),
  recommendationText: column.text("recommendation_text").notNull(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const RecommendationRelations = relations(
  TbRecommendations,
  ({ one }) => ({
    profile: one(TbProfile, {
      fields: [TbRecommendations.profileId],
      references: [TbProfile.id],
    }),
  })
);
