import "server-only";

import { cache } from "react";
import { db } from "@/db/drizzle";

const DEFAULT_APP_CONFIG = { id: "config", maintenance: false, theme: "modern" as const };

export const getAppConfig = cache(async () => {
  const config = await db.query.TbAppConfig.findFirst();
  return config ?? DEFAULT_APP_CONFIG;
});
