import { column, table } from "@/utils";

export const themeEnum = column.enum("theme", ["modern", "wireframe"]);

export const TbAppConfig = table("app_config", {
  id: column.text("id").primaryKey().default("config"),
  maintenance: column.boolean("maintenance").notNull().default(false),
  theme: themeEnum("theme").notNull().default("modern"),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
});

export type AppConfig = typeof TbAppConfig.$inferSelect;
export type AppConfigInsert = typeof TbAppConfig.$inferInsert;
