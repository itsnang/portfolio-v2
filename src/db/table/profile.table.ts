import { column, table } from "@/utils";
import { TbSkills } from "./skills.table";
import { relations } from "drizzle-orm";

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

export const ProfileRelations = relations(TbProfile, ({ many }) => ({
  skills: many(TbSkills),
}));

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
// });
