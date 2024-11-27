import { table, column } from "@/utils";
import { genId } from "@/utils/id";

export type TbExperiences = typeof TbExperiences;

export const TbExperiences = table("experiences", {
  id: column.id.$defaultFn(genId("experience")),
  title: column.text("title").notNull(),
  imageUrl: column.text("imageUrl"),
  description: column.text("description"),
  startDate: column.timestamp("startDate").notNull(),
  endDate: column.timestamp("endDate"),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
