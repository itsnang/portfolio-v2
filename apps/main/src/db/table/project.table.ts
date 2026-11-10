import { table, column } from "@/utils";
import { TbProfile } from "./profile.table";
import { relations } from "drizzle-orm";
import { genId } from "@/utils/id";

export type ProjectLinks = { type: string; href: string };
export type ProjectTechnology = { name: string; logoUrl: string };

export type TbProject = typeof TbProject;

export const TbProject = table("project", {
  id: column.id.$defaultFn(genId("project")),
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
  sortOrder: column.int("sort_order"),
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
