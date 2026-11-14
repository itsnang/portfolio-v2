# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from the repo root:

```bash
pnpm dev        # Start the Main Site (Next.js 16 + Turbopack)
pnpm build      # Production build
pnpm db:reset   # Recreate the local database with made-up content and the admin account
```

`pnpm --filter @portfolio/main lint` is currently broken: its `next lint` command no longer exists in Next 16.

## Repo layout

A pnpm 10 workspace. The app lives in `apps/main`, and every `src/...` path below is relative to it unless it names a package. Shared Packages live in `packages/` and export TypeScript source: they never import from a Site, and use relative or package imports instead of `@/`. `docs/site-split-spec.md` is the plan for splitting this into three Sites (Main, Blog, Admin) on separate subdomains, and `GLOSSARY.md` defines those terms.

## Local database

Local development runs against a throwaway Postgres in Docker (`packages/db/compose.yaml`), never production.

- `src/db/drizzle.ts` throws in development unless `DATABASE_URL` points at `localhost`.
- `pnpm db:reset` wipes and rebuilds it, using the hardcoded URL in `packages/db/src/local.ts`.
- There is no staging environment, so production is the only shared database.

## Schema changes

Three Sites will share one database, so every change must work with the code already running.

- Only `drizzle-kit generate` and `migrate` touch shared databases. `push` and manual SQL are for the throwaway local database.
- **Add:** new columns are nullable or have a default.
- **Rename:** add the new column, backfill, switch the code, drop the old one in a later migration.
- **Drop:** a separate later migration, once every Site has stopped using the column.
- **Enum value:** add it, deploy the readers, then start writing it.
- Rehearse locally, run it by hand with the owner credential, then merge the PR that uses it. Nothing runs migrations during a build.
- The migration history starts at a baseline verified against the live schema. Commands and the one-time production step are in `packages/db/README.md`.

## Environment Variables

Local values go in `apps/main/.env.local` (see `apps/main/.env.example`). Validated by Zod in `src/utils/env.ts`:

```
DATABASE_URL
ENCRYPTION_KEY
CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
IMAGE_FOLDER         # optional
BETTER_AUTH_SECRET   # min 32 chars
BETTER_AUTH_URL
```

## Architecture

Vertical-slice architecture: code is organized by feature/domain first, not by technical layer. Modeled on the sibling `pipfolio-trading-pnl` project's `src/features/<domain>/` pattern.

### Feature slices (`src/features/`)
Twelve domains: `achievement`, `app-config`, `auth`, `blog`, `education`, `experience`, `media`, `profile`, `project`, `recommendations`, `skills`, `socials`. Each slice has only the subfolders it needs:
```
src/features/<domain>/
  actions/          # 'use server' per-file; index.ts is a barrel re-export only
  queries.ts        # public reads, 'server-only'
  admin-queries.ts  # dashboard reads for Server Components, 'server-only', checks the session
  components/
  hooks/            # only if the domain needs its own hook (rare today)
  schemas/          # index.ts re-exports the domain's drizzle-zod schema from `@portfolio/db/schema`
  types.ts          # the domain's public TS types
  utils/
```
**Slices don't import each other**, with one sanctioned exception: `features/media` (image picker/upload/CRUD) is a genuine cross-cutting dependency that other slices import directly, the same way pipfolio's `features/profile/components/avatar-upload.tsx` is reused elsewhere. `features/profile` is the other expected exception in the other direction — it's the aggregate root (`getProfile()` joins every other domain), so `features/profile/types.ts` imports each leaf domain's exported type.

### Reads and writes
Keep them in separate files. Importing one export from a `'use server'` file can expose every export in it as a callable endpoint, so public pages must never import from `actions/`, directly or through its barrel. Every export left in a `'use server'` file must be wrapped in `withAuthAction`.

### Route Groups (`src/app/`)
Pure routing layer — `page.tsx`/`layout.tsx` files are thin wrappers that call a feature's queries or actions and render its components.
- `src/app/(home)/` — public portfolio, single profile page (`revalidate = 60`)
- `src/app/dashboard/` — admin CMS. `src/proxy.ts` only checks that a session cookie exists, so every dashboard read and write must check the session itself
- `src/app/api/` — Better Auth (`/api/auth/[...all]`)
- Route-local composition glue that spans 2+ features (e.g. `app/projects/[projectId]/project-detail.tsx`, `app/blog/[slug]/blog-detail.tsx`) stays colocated in the route folder rather than forced into a single feature.

### Database Layer (`packages/db`, `@portfolio/db`)
Stays fully centralized — not split per feature, same as pipfolio's `src/lib/db/`.
- `@portfolio/db/schema` — Drizzle tables (`TbProfile`, `TbProject`, etc.), drizzle-zod schemas, shared domain types (`IProfile`, `IProject`, ...) and `genId`. Opens no connection.
- `@portfolio/db/client` — `createDBClient` (requires `max`), `createDB`, and the `DB` type. Server-only.
- `@portfolio/db/queries` — reads both public Sites need (`getAppConfig`, `getPublishedBlogPosts`). Each takes a `DB` argument; the Site wraps it in one line that passes its own client and applies `cache()`.
- The package also holds `migrations/`, the drizzle-kit configs, the Compose file and the local fixtures.
- `apps/main/src/db/drizzle.ts` — the Main Site's own client, the development-only `localhost` guard, and `takeFirst`/`takeFirstOrThrow` helpers.

### Auth middleware (`src/lib/auth/middleware.ts`)
All auth-required actions wrap with `withAuthAction` from `src/lib/auth/middleware.ts` (cross-cutting infra, not feature-owned). The middleware resolves the Better Auth session and injects `{ user, session, profile, db }` as the first argument. Use `withOptionalAuthAction` for unauthenticated variants.

Return shape convention: `{ success: true, data, message }` or `{ success: false, error: string }`.

### UI package (`packages/ui`, `@portfolio/ui`)
UI used by public pages: the primitives they need (`@portfolio/ui/button`, `/card`, ...), `RichText` with its Tiptap node stylesheets, `cn`, `icons`, `date-utils`, `convert-date`, the `next/font` definitions (`/fonts`), and the base stylesheet (`/base.css`, imported first by `src/app/globals.css`, with `@source` so Tailwind scans the package). It must not depend on Better Auth, Cloudinary or the Tiptap editor.

### Wireframe package (`packages/wireframe`, `@portfolio/wireframe`)
The alternate site theme for the Main and Blog Sites: its components (`@portfolio/wireframe/<component>`), its stylesheet (`/styles.css`, imported by `src/app/globals.css`), and the OG image renderer (`/og`). The OG fonts live beside the renderer and are read with literal `new URL(..., import.meta.url)` paths, so the build traces exactly those files. Data types come from `@portfolio/db/schema`, never from a feature slice.

### Shared components (`src/components/`)
Everything here is cross-cutting infra used by 2+ features — not feature-owned:
- `ui/` — dashboard-only shadcn/ui primitives; public ones live in `@portfolio/ui`
- `tiptap-{extension,icons,node,templates,ui,ui-primitive}/` — vendored rich-text-editor toolkit (blog's editor is its only consumer today, but it's structured as a design-system package, not business logic)
- `dashboard-shell/` — sidebar/nav chrome used only by `app/dashboard/layout.tsx`
- `dock.tsx` / `nav-dock-client.tsx` — public-site nav dock (achievement + home pages)
- flat files (`form-sheet.tsx`, `delete-confirm-button.tsx`, `maintenance-banner.tsx`, `navbar.tsx`, `resume-card.tsx`) — generic reusable primitives

### Auth
Better Auth with email/password only. Single admin user seeded via `scripts/seed-admin.ts`. Auth config at `src/lib/auth/better-auth.ts`.

### Data Flow (Public Portfolio)
`src/features/profile/queries.ts` → `getProfile()` fetches the entire profile with all related records in one query → passes to each feature's section component as props.

### Image Handling
Cloudinary for image storage, via `src/features/media/` (actions, image-selector/image-upload/folder-selector components, its own dashboard CMS route). `uploadStagedFile` (a Server Action) calls Cloudinary directly — no intermediate API route. Files are validated client-side against `MAX_FILE_SIZE` (`src/features/media/constants.ts`, 5MB) before upload; `next.config.ts`'s `experimental.serverActions.bodySizeLimit` (8MB) must stay comfortably above that, since Next's Server Action default body limit is 1MB and would otherwise silently reject most real photos.

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `apps/main/node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
