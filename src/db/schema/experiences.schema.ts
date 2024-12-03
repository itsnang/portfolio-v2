import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TbExperiences } from "../table";
import { z } from "zod";

export const experiencesSchema = createSelectSchema(TbExperiences);

export const experiencesInsertSchema = createInsertSchema(TbExperiences, {
  title: z.string().min(3).max(255),
  imageUrl: z.string().url(),
  description: z.record(z.unknown()).optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
});

export type Experiences = z.infer<typeof experiencesSchema>;
export type ExperiencesInsert = z.infer<typeof experiencesInsertSchema>;
