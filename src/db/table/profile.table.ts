import { table, column } from "@/utils";

export type TbProfile = typeof TbProfile;

export const TbProfile = table("profile", {
  id: column.id,
  name: column.text("name").notNull(),
  imageUrl: column.text("imageUrl").notNull(),
  description: column.text("description"),
  abouts: column.text("abouts").notNull(),
  aboutsImage: column.text("aboutsImage").notNull(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
