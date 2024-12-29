import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TbSkills } from "../table";
import { z } from "zod";

export const skillsSchema = createSelectSchema(TbSkills);

export const skillsInsertSchema = createInsertSchema(TbSkills, {
  userId: z.string(),
  name: z.string().nonempty("Name is required"),
  isActive: z.boolean().default(true),
  logoUrl: z.string().url("Please Select Logo"),
});
export type Skills = z.infer<typeof skillsSchema>;
export type SkillsInsert = z.infer<typeof skillsInsertSchema>;
