import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { TbBlogPost, blogStatusEnum, blogCategoryEnum } from "../table";

export const blogPostSchema = createSelectSchema(TbBlogPost);

export const blogPostInsertSchema = createInsertSchema(TbBlogPost, {
  profileId: z.string().optional(),
  title: z.string().nonempty("Title is required"),
  slug: z
    .string()
    .nonempty("Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
  excerpt: z.string().nonempty("Excerpt is required"),
  // The image picker leaves this as "" (not undefined) when nothing is
  // selected, so an empty string must validate as "no image" too.
  coverImage: z
    .union([z.string().url("Invalid URL for cover image"), z.literal("")])
    .optional(),
  content: z.string().nonempty("Content is required"),
  status: z.enum(blogStatusEnum.enumValues).default("draft"),
  category: z.enum(blogCategoryEnum.enumValues).default("engineering"),
  publishedAt: z.date().nullable().optional(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;
export type BlogPostInsert = z.infer<typeof blogPostInsertSchema>;
