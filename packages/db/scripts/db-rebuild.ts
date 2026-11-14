import { execSync } from "node:child_process";

function run(command: string) {
  console.log(`\n$ ${command}`);
  execSync(command, { stdio: "inherit" });
}

run("docker compose down --volumes --remove-orphans");
run("docker compose up --detach --wait");
// The migration history has drifted from the schema until the baseline exists,
// so the throwaway database is built straight from the table definitions.
run("pnpm exec drizzle-kit push --config drizzle.local.config.ts --force");
