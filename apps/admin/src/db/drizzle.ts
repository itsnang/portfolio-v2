import { createSiteDB } from "@portfolio/db/client";

// Reads process.env directly rather than the validated env: scripts/seed-admin.ts
// imports this outside Next, with only DATABASE_URL set.
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set.");

export const db = createSiteDB({ url, max: 5, site: "admin" });
