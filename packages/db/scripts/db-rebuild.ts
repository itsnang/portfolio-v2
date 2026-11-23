import { execSync } from "node:child_process";
import { LOCAL_DATABASE_URL } from "../src/local";

function run(command: string) {
  console.log(`\n$ ${command}`);
  execSync(command, { stdio: "inherit" });
}

run("docker compose down --volumes --remove-orphans");
run("docker compose up --detach --wait");
run("pnpm exec drizzle-kit migrate --config drizzle.local.config.ts");
// Same path as production: apply roles.sql, set local-only passwords (the role
// names, so Sites can be pointed at the real roles on this machine), check grants.
execSync("tsx scripts/apply-roles.ts", {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: LOCAL_DATABASE_URL,
    PUBLIC_ROLE_PASSWORD: "portfolio_public",
    ADMIN_ROLE_PASSWORD: "portfolio_admin",
  },
});
