import { table, column } from "@/utils";
import { genId } from "@/utils/id";

export type TbProfile = typeof TbProfile;

export const TbProfile = table("profile", {
  id: column.id.$defaultFn(genId("user")),
  name: column.text("name").notNull(),
  socials: column.json("socials").default({}),
  abouts: column.json("abouts").default({}),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
