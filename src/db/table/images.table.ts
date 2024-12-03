import { column, table } from "@/utils";

export type TbImages = typeof TbImages;

export const TbImages = table("images", {
  id: column.id,
  isActive: column.boolean("is_active").default(true),
  imageUrl: column.text("image_url").notNull(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
