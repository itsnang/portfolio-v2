import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { TbAppConfig, themeEnum } from "../table";

export const appConfigSchema = createSelectSchema(TbAppConfig);

export const appConfigInsertSchema = createInsertSchema(TbAppConfig, {
  maintenance: z.boolean(),
  theme: z.enum(themeEnum.enumValues),
});

export type AppConfigSelect = z.infer<typeof appConfigSchema>;
export type AppConfigInsert = z.infer<typeof appConfigInsertSchema>;
