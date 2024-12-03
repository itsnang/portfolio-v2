import { table, column } from "@/utils";
import { TbProfile } from "./profile.table";
import { relations } from "drizzle-orm";
import { ProjectLinks } from "@/types/profile.type";

export type TbProject = typeof TbProject;

export const TbProject = table("project", {
  id: column.id,
  userId: column.int("user_id"),
  title: column.text("title").notNull(),
  href: column.text("href"),
  isActive: column.boolean("is_active").default(true),
  description: column.text("description").notNull(),
  technologies: column.json("technologies").$type<string[]>().notNull(),
  links: column.json("links").$type<ProjectLinks[]>(),
  image: column.text("image").notNull(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const ProjectRelations = relations(TbProject, ({ one }) => ({
  profiles: one(TbProfile, {
    fields: [TbProject.userId],
    references: [TbProfile.id],
  }),
}));
