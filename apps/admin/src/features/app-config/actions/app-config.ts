"use server";

import { TbAppConfig, appConfigInsertSchema, type AppConfigInsert } from "@portfolio/db/schema";

import { db } from "@/db/drizzle";
import { adminAction, parseInput } from "@/lib/admin-action";

export const updateAppConfigAction = adminAction(
  "Failed to update config",
  async (_ctx, input: AppConfigInsert) => {
    const { maintenance, theme } = parseInput(appConfigInsertSchema, input, "Invalid config data");
    const [config] = await db
      .insert(TbAppConfig)
      .values({ id: "config", maintenance, theme })
      .onConflictDoUpdate({
        target: TbAppConfig.id,
        set: { maintenance, theme, updatedAt: new Date() },
      })
      .returning();
    // Theme and maintenance mode are read on every public page.
    return { data: config, message: "Config updated", dashboardPath: "/dashboard/config", refresh: { resource: "app-config" } };
  }
);
