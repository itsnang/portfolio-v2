import { execSync } from "node:child_process";
import { LOCAL_DATABASE_URL } from "./local-database-url";

const env = { ...process.env, DATABASE_URL: LOCAL_DATABASE_URL };

function run(command: string) {
  console.log(`\n$ ${command}`);
  execSync(command, { stdio: "inherit", env });
}

run("docker compose down --volumes --remove-orphans");
run("docker compose up --detach --wait");
// The migration history has drifted from the schema until the baseline exists,
// so the throwaway database is built straight from the table definitions.
run("pnpm exec drizzle-kit push --config drizzle.local.config.ts --force");
run("pnpm exec tsx scripts/seed-admin.ts");
run("pnpm exec tsx scripts/db-fixtures.ts");

console.log("\nLocal database is ready.");
