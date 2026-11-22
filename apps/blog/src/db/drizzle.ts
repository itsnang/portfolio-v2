import "server-only";

import { createDB, createDBClient } from "@portfolio/db/client";
import { env } from "@/utils/env";

// Local development must never reach the production database.
if (
  env.NODE_ENV === "development" &&
  !["localhost", "127.0.0.1", "[::1]"].includes(new URL(env.DATABASE_URL).hostname)
) {
  throw new Error(
    "DATABASE_URL must point at localhost in development. Run `pnpm db:reset` and copy DATABASE_URL from apps/blog/.env.example into apps/blog/.env.local."
  );
}

const client = createDBClient({ url: env.DATABASE_URL, max: 5 });
export const db = createDB(client);
