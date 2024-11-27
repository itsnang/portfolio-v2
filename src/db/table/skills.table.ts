import { table, column } from "@/utils";

export type TbSkills = typeof TbSkills;

export const TbSkills = table("skills", {
  id: column.id,
  name: column.text("name").notNull(),
  logoUrl: column.text("logoUrl").notNull(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
