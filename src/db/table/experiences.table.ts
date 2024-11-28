import { table, column } from "@/utils";

export type TbExperiences = typeof TbExperiences;

export const TbExperiences = table("experiences", {
  id: column.int("id").notNull(),
  title: column.text("title").notNull(),
  imageUrl: column.text("imageUrl"),
  description: column.text("description"),
  startDate: column.timestamp("startDate").notNull(),
  endDate: column.timestamp("endDate"),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
