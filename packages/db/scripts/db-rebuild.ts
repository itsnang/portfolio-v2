import { execSync } from "node:child_process";

function run(command: string) {
  console.log(`\n$ ${command}`);
  execSync(command, { stdio: "inherit" });
}

run("docker compose down --volumes --remove-orphans");
run("docker compose up --detach --wait");
run("pnpm exec drizzle-kit migrate --config drizzle.local.config.ts");
run("docker compose exec -T db psql -v ON_ERROR_STOP=1 -q -U portfolio -d portfolio -f - < roles.sql");
// Local-only passwords, so Sites can be pointed at the real roles on this machine.
run(`docker compose exec -T db psql -v ON_ERROR_STOP=1 -q -U portfolio -d portfolio -c "ALTER ROLE portfolio_public PASSWORD 'portfolio_public'; ALTER ROLE portfolio_admin PASSWORD 'portfolio_admin';"`);
