import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TbEducation } from "../table";
import { z } from "zod";

export const educationSchema = createSelectSchema(TbEducation);

export const educationInsertSchema = createInsertSchema(TbEducation, {
  userId: z.string(),
  school: z.string().min(1, "School is required"),
  degree: z.string().min(1, "Degree is required"),
  logoUrl: z.string().url("Invalid URL"),
  href: z.string().url("Invalid URL").optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  isActive: z.boolean().default(true),
});

export type Education = z.infer<typeof educationSchema>;
export type EducationInsert = z.infer<typeof educationInsertSchema>;
