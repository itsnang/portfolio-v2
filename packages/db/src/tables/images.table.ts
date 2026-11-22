import { column, table } from "../column";
import { genId } from "../id";

export type TbImages = typeof TbImages;

export const TbImages = table("images", {
  id: column.id.$defaultFn(genId("images")),
  isActive: column.boolean("is_active").default(true),
  imageUrl: column.text("image_url").notNull(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
