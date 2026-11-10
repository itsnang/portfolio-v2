import { table, column } from "@/utils";
import { TbProfile } from "./profile.table";
import { relations } from "drizzle-orm";
import { genId } from "@/utils/id";

export const blogStatusEnum = column.enum("blog_status", [
  "draft",
  "published",
]);

export type BlogStatus = (typeof blogStatusEnum.enumValues)[number];

export const blogCategoryEnum = column.enum("blog_category", [
  "engineering",
  "design",
  "notes",
]);

export type BlogCategory = (typeof blogCategoryEnum.enumValues)[number];

export type TbBlogPost = typeof TbBlogPost;

export const TbBlogPost = table("blog_post", {
  id: column.id.$defaultFn(genId("blog")),
  profileId: column.text("profile_id").references(() => TbProfile.id),
  title: column.text("title").notNull(),
  slug: column.text("slug").notNull().unique(),
  excerpt: column.text("excerpt").notNull(),
  coverImage: column.text("cover_image"),
  content: column.text("content").notNull(),
  status: blogStatusEnum("status").notNull().default("draft"),
  category: blogCategoryEnum("category").notNull().default("engineering"),
  publishedAt: column.timestamp("published_at", {
    mode: "date",
    withTimezone: true,
  }),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const BlogPostRelations = relations(TbBlogPost, ({ one }) => ({
  profiles: one(TbProfile, {
    fields: [TbBlogPost.profileId],
    references: [TbProfile.id],
  }),
}));
