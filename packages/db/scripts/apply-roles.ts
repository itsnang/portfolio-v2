import { createHash, createHmac, pbkdf2Sync, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import postgres from "postgres";

// Applies roles.sql to DATABASE_URL (the owner credential), optionally sets
// the roles' passwords, then checks every table's grants against roles.sql.
// Safe to re-run: roles.sql is idempotent. Prints no secrets.
//
//   DATABASE_URL=<owner>                          apply roles.sql and check
//   PUBLIC_ROLE_PASSWORD / ADMIN_ROLE_PASSWORD    also set that role's password

const ROLES = { public: "portfolio_public", admin: "portfolio_admin" } as const;
type Role = (typeof ROLES)[keyof typeof ROLES];
const WRITES = ["INSERT", "UPDATE", "DELETE"] as const;

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Set DATABASE_URL to the database's owner connection string.");
const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(new URL(url).hostname);

const passwords: [Role, string | undefined][] = [
  [ROLES.public, process.env.PUBLIC_ROLE_PASSWORD],
  [ROLES.admin, process.env.ADMIN_ROLE_PASSWORD],
];
for (const [role, password] of passwords) {
  if (password === undefined) continue;
  // Local passwords are the role names; production ones must be long and random.
  const minLength = isLocal ? 1 : 24;
  if (password.length < minLength || !/^[A-Za-z0-9_]+$/.test(password)) {
    throw new Error(`The password for ${role} must be ${minLength}+ letters, digits or underscores.`);
  }
}

const rolesSql = readFileSync(new URL("../roles.sql", import.meta.url), "utf8");

/** The tables roles.sql grants portfolio_public SELECT on, read from the file so there's one list. */
function publicTables(source: string): Set<string> {
  const match = source.match(/GRANT SELECT ON\s+([\s\S]*?)\s+TO portfolio_public;/);
  if (!match) throw new Error("Couldn't find portfolio_public's table list in roles.sql.");
  return new Set(match[1].split(",").map((name) => name.trim()));
}

/**
 * A SCRAM-SHA-256 verifier, the form Postgres stores passwords in. Sending it
 * instead of the password keeps the plaintext out of statement logs.
 */
function scramVerifier(password: string): string {
  const salt = randomBytes(16);
  const iterations = 4096;
  const salted = pbkdf2Sync(password, salt, iterations, 32, "sha256");
  const clientKey = createHmac("sha256", salted).update("Client Key").digest();
  const storedKey = createHash("sha256").update(clientKey).digest();
  const serverKey = createHmac("sha256", salted).update("Server Key").digest();
  return `SCRAM-SHA-256$${iterations}:${salt.toString("base64")}$${storedKey.toString("base64")}:${serverKey.toString("base64")}`;
}

const sql = postgres(url, { max: 1, onnotice: () => {} });

async function main() {
  console.log(`Database host: ${new URL(url!).hostname}`);

  await sql.unsafe(rolesSql);
  console.log("Applied roles.sql");

  for (const [role, password] of passwords) {
    if (!password) continue;
    // A verifier is only base64, digits and $:, so it needs no escaping; ALTER ROLE can't bind it.
    await sql.unsafe(`ALTER ROLE ${role} PASSWORD '${scramVerifier(password)}'`);
    console.log(`Set the password for ${role}`);
  }

  const readable = publicTables(rolesSql);
  const tables = await sql<{ name: string }[]>`
    select tablename as name from pg_tables where schemaname = 'public' order by tablename`;
  const can = async (role: Role, table: string, privilege: string) => {
    const [{ ok }] = await sql<{ ok: boolean }[]>`
      select has_table_privilege(${role}, format('public.%I', ${table}::text), ${privilege}) as ok`;
    return ok;
  };

  const problems: string[] = [];
  for (const { name } of tables) {
    if ((await can(ROLES.public, name, "SELECT")) !== readable.has(name)) {
      problems.push(`${ROLES.public} ${readable.has(name) ? "can't" : "can"} read ${name}`);
    }
    for (const privilege of WRITES) {
      if (await can(ROLES.public, name, privilege)) problems.push(`${ROLES.public} can ${privilege} ${name}`);
    }
    for (const privilege of ["SELECT", ...WRITES]) {
      if (!(await can(ROLES.admin, name, privilege))) problems.push(`${ROLES.admin} can't ${privilege} ${name}`);
    }
  }
  for (const missing of [...readable].filter((name) => !tables.some((t) => t.name === name))) {
    problems.push(`roles.sql lists ${missing}, which doesn't exist`);
  }
  for (const role of Object.values(ROLES)) {
    const [{ ok }] = await sql<{ ok: boolean }[]>`select has_schema_privilege(${role}, 'public', 'CREATE') as ok`;
    if (ok) problems.push(`${role} can create objects in public`);
  }

  if (problems.length > 0) {
    for (const problem of problems) console.log(`FAIL ${problem}`);
    throw new Error(`${problems.length} permission check(s) failed.`);
  }
  console.log(
    `ok   ${tables.length} tables: ${ROLES.public} reads ${readable.size} and writes none; ` +
      `${ROLES.admin} reads and writes all; neither can create objects`
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
