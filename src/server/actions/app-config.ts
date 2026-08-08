"use server";

import { db } from "@/db/drizzle";
import { TbAppConfig } from "@/db/table";
import { appConfigInsertSchema, AppConfigInsert } from "@/db/schema/app-config.schema";
import { withAuthAction } from "./middleware";

export const getAppConfigAction = withAuthAction(async () => {
  const config = await db.query.TbAppConfig.findFirst();
  return {
    success: true,
    data: config ?? { id: "config", maintenance: false, theme: "modern" as const },
  };
});

export const updateAppConfigAction = withAuthAction(
  async (_auth, data: AppConfigInsert) => {
    try {
      const validated = appConfigInsertSchema.safeParse(data);
      if (!validated.success) {
        throw new Error("Invalid config data");
      }

      const result = await db
        .insert(TbAppConfig)
        .values({ id: "config", ...data })
        .onConflictDoUpdate({
          target: TbAppConfig.id,
          set: {
            maintenance: data.maintenance,
            theme: data.theme,
            updatedAt: new Date(),
          },
        })
        .returning();

      return { success: true, data: result[0], message: "Config updated" };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Failed to update config" };
    }
  }
);
