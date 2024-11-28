import { table, column } from "@/utils";
import { TbProfile } from "./profile.table";
import { relations } from "drizzle-orm";

export type TbSkills = typeof TbSkills;

export const TbSkills = table("skills", {
  id: column.id,
  userId: column.int("userId"),
  name: column.text("name").notNull(),
  logoUrl: column.text("logoUrl").notNull(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const SkillRelations = relations(TbSkills, ({ one }) => ({
  profiles: one(TbProfile, {
    fields: [TbSkills.userId],
    references: [TbProfile.id],
  }),
}));
