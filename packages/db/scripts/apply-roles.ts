import { readFileSync } from "node:fs";
import postgres from "postgres";

// Applies roles.sql to DATABASE_URL (the owner credential), optionally sets
// the roles' passwords, then checks what each role can do. Safe to re-run:
// roles.sql is idempotent. Prints no secrets.
//
//   DATABASE_URL=<owner>                     apply roles.sql only
//   PUBLIC_ROLE_PASSWORD / ADMIN_ROLE_PASSWORD   also set that role's password

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Set DATABASE_URL to the database's owner connection string.");

const passwords = {
  portfolio_public: process.env.PUBLIC_ROLE_PASSWORD,
  portfolio_admin: process.env.ADMIN_ROLE_PASSWORD,
};
for (const [role, password] of Object.entries(passwords)) {
  // ALTER ROLE can't take a bound parameter, so only allow characters that need no quoting.
  if (password !== undefined && !/^[A-Za-z0-9]{24,}$/.test(password)) {
    throw new Error(`The password for ${role} must be at least 24 letters or digits.`);
  }
}

const rolesSql = readFileSync(new URL("../roles.sql", import.meta.url), "utf8");
const sql = postgres(url, { max: 1, onnotice: () => {} });

async function main() {
  console.log(`Database host: ${new URL(url!).hostname}`);

  await sql.unsafe(rolesSql);
  console.log("Applied roles.sql");

  for (const [role, password] of Object.entries(passwords)) {
    if (!password) continue;
    await sql.unsafe(`ALTER ROLE ${role} PASSWORD '${password}'`);
    console.log(`Set the password for ${role}`);
  }

  const checks: [string, string, boolean][] = [
    ["portfolio_public can read profile", "select has_table_privilege('portfolio_public', 'profile', 'SELECT') as ok", true],
    ["portfolio_public can't write blog_post", "select has_table_privilege('portfolio_public', 'blog_post', 'INSERT') as ok", false],
    ["portfolio_public can't read user", `select has_table_privilege('portfolio_public', '"user"', 'SELECT') as ok`, false],
    ["portfolio_admin can write blog_post", "select has_table_privilege('portfolio_admin', 'blog_post', 'INSERT') as ok", true],
    ["portfolio_admin can write session", "select has_table_privilege('portfolio_admin', 'session', 'INSERT') as ok", true],
    ["portfolio_admin can't create tables", "select has_schema_privilege('portfolio_admin', 'public', 'CREATE') as ok", false],
  ];
  let failed = 0;
  for (const [label, query, expected] of checks) {
    const [{ ok }] = await sql.unsafe<{ ok: boolean }[]>(query);
    const pass = ok === expected;
    if (!pass) failed++;
    console.log(`${pass ? "ok  " : "FAIL"} ${label}`);
  }
  if (failed > 0) throw new Error(`${failed} permission check(s) failed.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
