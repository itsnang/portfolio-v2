import { table, column } from "@/utils";

export type TbEducation = typeof TbEducation;

export const TbEducation = table("education", {
  id: column.id,
  isActive: column.boolean("is_active").default(true),
  school: column.text("school").notNull(),
  degree: column.text("degree").notNull(),
  logoUrl: column.text("logo_url"),
  startDate: column.timestamp("start_date").notNull(),
  endDate: column.timestamp("end_date"),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
