import { defineConfig } from "drizzle-kit";
import { LOCAL_DATABASE_URL } from "./scripts/local-database-url";

// Hardcoded so `db:reset` can never push to the database in DATABASE_URL.
export default defineConfig({
  schema: "./src/db/table/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: LOCAL_DATABASE_URL,
  },
});
