import { table, column } from "@/utils";
import { genId } from "@/utils/id";

export type TbProfile = typeof TbProfile;

export const TbProfile = table("profile", {
  id: column.id.$defaultFn(genId("user")),
  name: column.text("name").notNull(),
  imageUrl: column.text("imageUrl").notNull(),
  socials: column.json("socials").default({}),
  skills: column.json("skills").default({}),
  description: column.text("description"),
  abouts: column.json("abouts").default({}),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
