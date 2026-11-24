import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./tables";
import postgres from "postgres";

const IDLE_TIMEOUT_SECONDS = 20;

export type CreateDBClientConfig = {
  url: string;
  max: number;
};

export function createDBClient(config: CreateDBClientConfig) {
  return postgres(config.url, { max: config.max, idle_timeout: IDLE_TIMEOUT_SECONDS });
}

export type DBClient = ReturnType<typeof createDBClient>;

export function createDB(client: DBClient) {
  return drizzle(client, { schema });
}

export type DB = ReturnType<typeof createDB>;

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

/**
 * A Site's database. In development it refuses any DATABASE_URL that isn't
 * localhost, so local work never reaches production.
 */
export function createSiteDB({ url, max, site }: CreateDBClientConfig & { site: string }): DB {
  if (process.env.NODE_ENV === "development" && !LOCAL_HOSTS.includes(new URL(url).hostname)) {
    throw new Error(
      `DATABASE_URL must point at localhost in development. Run \`pnpm db:reset\` and copy DATABASE_URL from apps/${site}/.env.example into apps/${site}/.env.local.`
    );
  }
  return createDB(createDBClient({ url, max }));
}
