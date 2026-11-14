# @portfolio/db

Tables, validation, shared types, the client factory and the migration history for every Site. Schema-change rules are in the root `CLAUDE.md`.

## Commands

Run from the repo root unless noted.

```bash
pnpm db:reset                                   # recreate the local database from migrations, plus admin account and fixtures
pnpm --filter @portfolio/db db:generate         # write a migration for a change to src/tables
pnpm --filter @portfolio/db db:migrate          # apply pending migrations to DATABASE_URL
pnpm --filter @portfolio/db db:mark-baseline    # dry run; add --apply to write
```

`db:generate` and `db:migrate` use `drizzle.config.ts`, which reads `DATABASE_URL`. Point it at production only to run a migration by hand with the owner credential, after rehearsing it locally.

## Migration history

The history starts at `migrations/0000_baseline.sql`, generated from the table definitions after checking that they match the live schema exactly (columns, defaults, enums, constraints and indexes). The older per-environment folders were removed because they had drifted from the live schema.

### Marking the baseline as applied in production (one time)

Production already has every table, so `migrate` must skip the baseline there instead of running it. This writes one row to `drizzle.__drizzle_migrations` with the owner credential.

1. Take a backup or confirm your provider's point-in-time restore covers now.
2. Dry run, and check it prints the production host and "Dry run: would record the baseline as applied":
   ```bash
   DATABASE_URL='<owner connection string>' pnpm --filter @portfolio/db db:mark-baseline
   ```
3. Write it:
   ```bash
   DATABASE_URL='<owner connection string>' pnpm --filter @portfolio/db db:mark-baseline --apply
   ```
4. Confirm nothing is pending. It should report success without changing anything:
   ```bash
   DATABASE_URL='<owner connection string>' pnpm --filter @portfolio/db db:migrate
   ```

The script refuses a database without the existing schema, refuses if a recorded migration is newer than the baseline, and does nothing if the baseline is already recorded.
