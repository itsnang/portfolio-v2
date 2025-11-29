import { column, table } from "@/utils";
import { genId } from "@/utils/id";
import { relations } from "drizzle-orm";
import { TbProfile } from "./profile.table";

export type TbExperiences = typeof TbExperiences;

export const TbExperiences = table("experiences", {
  id: column.id.$default(genId("experience")),
  userId: column.text("user_id"),
  isActive: column.boolean("is_active").default(true),
  company: column.text("company").notNull(),
  title: column.text("title").notNull(),
  imageUrl: column.text("image_url").notNull(),
  description: column.text("description"),
  startDate: column.timestamp("start_date").notNull(),
  endDate: column.timestamp("end_date"),
  sortOrder: column.int("sort_order"),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const ExperienceRelations = relations(TbExperiences, ({ one }) => ({
  profiles: one(TbProfile, {
    fields: [TbExperiences.userId],
    references: [TbProfile.id],
  }),
}));
