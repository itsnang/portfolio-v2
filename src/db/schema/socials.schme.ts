import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { TbSocials } from "../table";

export const socialsSchema = createSelectSchema(TbSocials);

export const socialsInsertSchema = createInsertSchema(TbSocials, {
  userId: z.string(),
  name: z.string().nonempty("Name is required"),
  isActive: z.boolean().default(true),
  icon: z.string().url("Please Select icon"),
  url: z.string().url(),
});
export type Socials = z.infer<typeof socialsSchema>;
export type SocialsInsert = z.infer<typeof socialsInsertSchema>;
