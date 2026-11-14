import { createDB, createDBClient } from "@portfolio/db/client";
import { config } from "dotenv";
// import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env" }); // or .env.local
const databaseUrl = process.env.DATABASE_URL!;

// Local development must never reach the production database.
if (
  process.env.NODE_ENV === "development" &&
  !["localhost", "127.0.0.1", "[::1]"].includes(new URL(databaseUrl).hostname)
) {
  throw new Error(
    "DATABASE_URL must point at localhost in development. Run `pnpm db:reset` and copy DATABASE_URL from apps/main/.env.example into apps/main/.env.local."
  );
}

const client = createDBClient({ url: databaseUrl, max: 5 });
export const db = createDB(client);

export function takeFirst<T>(data: T[]): T | undefined {
  return data.at(0);
}

export function takeFirstOrThrow<T>(data: T[]): T {
  if (data[0]) return data[0];
  throw new Error("Data not found");
}
