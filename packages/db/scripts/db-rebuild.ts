import { execSync } from "node:child_process";

function run(command: string) {
  console.log(`\n$ ${command}`);
  execSync(command, { stdio: "inherit" });
}

run("docker compose down --volumes --remove-orphans");
run("docker compose up --detach --wait");
run("pnpm exec drizzle-kit migrate --config drizzle.local.config.ts");
