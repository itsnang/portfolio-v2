import { table, column } from "@/utils";

export type TbExperiences = typeof TbExperiences;

export const TbExperiences = table("experiences", {
  id: column.id,
  isActive: column.boolean("is_active").default(true),
  company: column.text("company").notNull(),
  title: column.text("title").notNull(),
  imageUrl: column.text("image_url"),
  description: column.text("description"),
  startDate: column.timestamp("start_date").notNull(),
  endDate: column.timestamp("end_date"),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
