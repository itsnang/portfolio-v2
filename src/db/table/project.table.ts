import { table, column } from "@/utils";

type ProjectLinks = { type: string; href: string };

export type TbProject = typeof TbProject;

export const TbProject = table("project", {
  id: column.int("id").notNull(),
  title: column.text("title").notNull(),
  href: column.text("href"),
  isActive: column.boolean("is_active").default(true),
  description: column.text("description"),
  technologies: column.json("technologies").$type<string[]>(),
  links: column.json("links").$type<ProjectLinks[]>(),
  image: column.text("image").notNull(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
