import { table, column } from "@/utils";
import { TbProfile } from "./profile.table";
import { relations } from "drizzle-orm";
import { genId } from "@/utils/id";

export const skillCategoryEnum = column.enum("skill_category", [
  "Frontend",
  "Backend",
  "Mobile",
  "Database",
  "Tools",
]);

export type SkillCategory = (typeof skillCategoryEnum.enumValues)[number];

export type TbSkills = typeof TbSkills;

export const TbSkills = table("skills", {
  id: column.id.$defaultFn(genId("skills")),
  isActive: column.boolean("is_active").default(true),
  userId: column.text("user_id"),
  name: column.text("name").notNull(),
  logoUrl: column.text("logo_url").notNull(),
  category: skillCategoryEnum("category").notNull().default("Tools"),
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
