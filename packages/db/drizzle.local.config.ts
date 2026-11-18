import { defineConfig } from "drizzle-kit";
import { LOCAL_DATABASE_URL } from "./src/local";

// Hardcoded so `db:reset` can never push to the database in DATABASE_URL.
export default defineConfig({
  schema: "./src/tables/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: LOCAL_DATABASE_URL,
  },
});
