import { column, table } from "@/utils";
import { relations } from "drizzle-orm";

export type TbImages = typeof TbImages;

export const TbImages = table("images", {
  id: column.id,
  isActive: column.boolean("is_active").default(true),
  imageUrl: column.text("image_url").notNull(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
