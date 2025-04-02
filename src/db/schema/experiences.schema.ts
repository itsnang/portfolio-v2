import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TbExperiences } from "../table";
import { z } from "zod";

export const experiencesSchema = createSelectSchema(TbExperiences);

export const experiencesInsertSchema = createInsertSchema(TbExperiences, {
  userId: z.string(),
  isActive: z.boolean().default(true),
  company: z.string().nonempty("Company is required"),
  title: z.string().nonempty("Title is required"),
  imageUrl: z.string().url("Please provide a valid image URL"),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
});

export type Experiences = z.infer<typeof experiencesSchema>;
export type ExperiencesInsert = z.infer<typeof experiencesInsertSchema>;
