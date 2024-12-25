import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TbProfile } from "../table";

export const profileSchema = createSelectSchema(TbProfile);

export const profileInsertSchema = createInsertSchema(TbProfile, {
  name: z.string().min(3).max(255),
  imageUrl: z.string().url(),
  abouts: z.string(),
  aboutImages: z.array(z.string().url()),
  isAvailable: z.boolean(),
  bio: z.string(),
});

export type Profile = z.infer<typeof profileSchema>;
export type ProfileInsert = z.infer<typeof profileInsertSchema>;
