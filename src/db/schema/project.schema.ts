import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TbProject } from "../table";
import { z } from "zod";

export const projectSchema = createSelectSchema(TbProject);

export const projecInsertSchema = createInsertSchema(TbProject, {
  profileId: z.string(),
  title: z.string().nonempty("Title is required"),
  href: z.string().url().optional(),
  isActive: z.boolean().default(true),
  description: z.string().nonempty("Description is required"),
  technologies: z
    .array(
      z.object({
        name: z.string().nonempty("Technology name is required"),
        logoUrl: z.string().url("Invalid URL for logo"),
      })
    )
    .nonempty("Technologies must include at least one item"),
  links: z
    .array(
      z.object({
        type: z.string().nonempty("Link type is required"),
        href: z.string().url("Invalid URL for link"),
      })
    )
    .optional(),
  thumbnail: z.string().url().nonempty("Thumbnail is required"),
  detailImage: z.array(z.string().url()).optional(),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectInsert = z.infer<typeof projecInsertSchema>;
