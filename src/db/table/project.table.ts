import { table, column } from "@/utils";
import { TbProfile } from "./profile.table";
import { relations } from "drizzle-orm";
import { ProjectLinks, ProjectTechnology } from "@/types/profile.type";

export type TbProject = typeof TbProject;

export const TbProject = table("project", {
  id: column.id,
  profileId: column.text("profile_id").references(() => TbProfile.id),
  title: column.text("title").notNull(),
  href: column.text("href"),
  isActive: column.boolean("is_active").default(true),
  description: column.text("description").notNull(),
  technologies: column
    .json("technologies")
    .$type<ProjectTechnology[]>()
    .notNull(),
  links: column.json("links").$type<ProjectLinks[]>(),
  thumbnail: column.text("thumbnail").notNull(),
  detailImage: column.json("detail_image").$type<string[]>(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const ProjectRelations = relations(TbProject, ({ one }) => ({
  profiles: one(TbProfile, {
    fields: [TbProject.profileId],
    references: [TbProfile.id],
  }),
}));
