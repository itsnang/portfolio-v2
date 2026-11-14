import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import postgres from "postgres";

// Records the baseline migration as already applied on a database whose
// schema existed before the baseline did, so `drizzle-kit migrate` skips it
// instead of trying to recreate every table. Dry run unless --apply is passed.

const apply = process.argv.includes("--apply");
const url = process.env.DATABASE_URL;
if (!url) throw new Error("Set DATABASE_URL to the database's owner connection string.");

const journal: { entries: { tag: string; when: number }[] } = JSON.parse(
  readFileSync(new URL("../migrations/meta/_journal.json", import.meta.url), "utf8")
);
const baseline = journal.entries[0];
if (!baseline || !baseline.tag.endsWith("_baseline")) {
  throw new Error("The first migration in the journal is not the baseline.");
}
const query = readFileSync(new URL(`../migrations/${baseline.tag}.sql`, import.meta.url), "utf8");
// Same hash drizzle-orm's migrator records for an applied migration.
const hash = createHash("sha256").update(query).digest("hex");

const sql = postgres(url, { max: 1 });

async function main() {
  console.log(`Database host: ${new URL(url!).hostname}`);
  console.log(`Baseline: ${baseline.tag} (when=${baseline.when})`);

  const [{ exists: hasSchema }] = await sql`
    select exists (select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'blog_post' and column_name = 'category') as exists`;
  if (!hasSchema) {
    throw new Error("This database doesn't have the existing schema. Run `drizzle-kit migrate` on it instead.");
  }

  const [{ exists: hasTable }] = await sql`
    select exists (select 1 from information_schema.tables
      where table_schema = 'drizzle' and table_name = '__drizzle_migrations') as exists`;
  if (hasTable) {
    const rows = await sql`select created_at from drizzle.__drizzle_migrations where hash = ${hash}`;
    if (rows.length > 0) {
      console.log("Already marked as applied. Nothing to do.");
      return;
    }
    const [latest] = await sql`select max(created_at)::bigint as max from drizzle.__drizzle_migrations`;
    if (latest?.max && Number(latest.max) >= baseline.when) {
      throw new Error("A recorded migration is newer than the baseline, so it would never run. Stop and investigate.");
    }
  }

  if (!apply) {
    console.log("Dry run: would record the baseline as applied. Re-run with --apply to write it.");
    return;
  }

  await sql.begin(async (tx) => {
    await tx`create schema if not exists drizzle`;
    await tx`create table if not exists drizzle.__drizzle_migrations (id serial primary key, hash text not null, created_at bigint)`;
    await tx`insert into drizzle.__drizzle_migrations (hash, created_at) values (${hash}, ${baseline.when})`;
  });
  console.log("Recorded the baseline as applied.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
