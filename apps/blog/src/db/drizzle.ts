import "server-only";

import { createSiteDB } from "@portfolio/db/client";
import { env } from "@/utils/env";

export const db = createSiteDB({ url: env.DATABASE_URL, max: 5, site: "blog" });
