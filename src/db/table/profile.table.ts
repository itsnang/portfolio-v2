import { column, table } from "@/utils";
import { TbSkills } from "./skills.table";
import { relations } from "drizzle-orm";
import { TbEducation } from "./education.table";
import { TbProject } from "./project.table";
import { TbExperiences } from "./experiences.table";
import { TbSocials } from "./socials.table";

export type TbProfile = typeof TbProfile;

export const TbProfile = table("profile", {
  id: column.id,
  isAvailable: column.boolean("is_available").notNull(),
  name: column.text("name").notNull(),
  bio: column.text("bio"),
  imageUrl: column.text("profile_url").notNull(),
  abouts: column.text("abouts").notNull(),
  aboutImages: column.json("about_images").$type<string[]>(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const ProfileRelations = relations(TbProfile, ({ many }) => ({
  skills: many(TbSkills),
  experience: many(TbExperiences),
  education: many(TbEducation),
  projects: many(TbProject),
  socials: many(TbSocials),
}));
