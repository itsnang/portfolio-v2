import { table, column } from "@/utils";

export type TbSocials = typeof TbSocials;

export const TbSocials = table("socials", {
  id: column.int("id").notNull(),
  name: column.text("name").notNull(),
  url: column.text("url").notNull(),
  icon: column.text("icon").notNull(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
