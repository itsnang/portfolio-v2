import { column, table } from "@/utils";
import { TbSkills } from "./skills.table";
import { relations } from "drizzle-orm";

export type TbProfile = typeof TbProfile;

export const TbProfile = table("profile", {
  id: column.id,
  isAvailable: column.boolean("is_available"),
  name: column.text("name").notNull(),
  bio: column.text("bio"),
  imageUrl: column.text("profile_url").notNull(),
  abou: column.text("abouts").notNull(),
  aboutImages: column.json("about_images").$type<string[]>(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const ProfileRelations = relations(TbProfile, ({ many }) => ({
  skills: many(TbSkills),
}));
