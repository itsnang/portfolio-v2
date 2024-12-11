import { table, column } from "@/utils";
import { relations } from "drizzle-orm";
import { TbProfile } from "./profile.table";

export type TbEducation = typeof TbEducation;

export const TbEducation = table("education", {
  id: column.id,
  userId: column.text("user_id"),
  isActive: column.boolean("is_active").default(true),
  school: column.text("school").notNull(),
  degree: column.text("degree").notNull(),
  logoUrl: column.text("logo_url").notNull(),
  href: column.text("href"),
  startDate: column.timestamp("start_date").notNull(),
  endDate: column.timestamp("end_date"),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const EducationRelations = relations(TbEducation, ({ one }) => ({
  profiles: one(TbProfile, {
    fields: [TbEducation.userId],
    references: [TbProfile.id],
  }),
}));
