import { createDB, createDBClient } from "@/utils/init";
import { config } from "dotenv";
// import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env" }); // or .env.local
const client = createDBClient({ url: process.env.DATABASE_URLL!, max: 500 });
export const db = createDB(client);

export function takeFirst<T>(data: T[]): T | undefined {
  return data.at(0);
}

export function takeFirstOrThrow<T>(data: T[]): T {
  if (data[0]) return data[0];
  throw new Error("Data not found");
}
