# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from the repo root:

```bash
pnpm dev         # Start the Main Site (3000), the Blog Site (3001) and the Admin Site (3002)
pnpm dev:main    # Main Site only
pnpm dev:blog    # Blog Site only
pnpm dev:admin   # Admin Site only
pnpm build       # Production build of the Main Site
pnpm --filter @portfolio/blog build
pnpm --filter @portfolio/admin build
pnpm db:reset    # Recreate the local database with made-up content and the admin account
```

## Repo layout

A pnpm 10 workspace. The Main Site lives in `apps/main` and every `src/...` path below is relative to it unless it names another Site or a package. The Main Site is public pages only; the dashboard, auth and every write live in the Admin Site, which keeps the same `src/` layout, so Admin-only paths below are under `apps/admin`. The Main Site is no longer a PWA: `apps/main/public/sw.js` is a committed no-op that unregisters the old service worker, and must stay for at least 12 months after it ships. Shared Packages live in `packages/` and export TypeScript source: they never import from a Site, and use relative or package imports instead of `@/`. `docs/site-split-spec.md` is the plan for splitting this into three Sites (Main, Blog, Admin) on separate subdomains, and `GLOSSARY.md` defines those terms.

### Blog Site (`apps/blog`)
The Post list at `/` and each Post at `/:slug`, in both themes, on port 3001 locally. It's read-only: it connects as `portfolio_public`, reads through `src/lib/queries.ts` (thin wrappers over `@portfolio/db/queries`), and lists no Better Auth, Cloudinary or Tiptap editor packages. Its env schema (`src/utils/env.ts`) is `DATABASE_URL`, `REVALIDATE_SECRET`, `NEXT_PUBLIC_MAIN_URL` and `NEXT_PUBLIC_BLOG_URL`; links to the Main Site are plain `<a>` tags built from `NEXT_PUBLIC_MAIN_URL`. Its own `/api/revalidate` uses the same message and token check as the Main Site's: `post` refreshes the Post list, those Posts and the sitemap, `app-config` every page, and anything else nothing. SEO URLs come from `src/lib/metadata.ts`: Post canonical, Open Graph and JSON-LD URLs use the Blog Site, and author and publisher URLs the Main Site. Not a PWA. Its local env is `apps/blog/.env.local` (see `apps/blog/.env.example`). The Main Site has no blog pages: `next.config.ts` redirects `/blog` and `/blog/:path*` to the Blog Site (temporary until step 9 of the spec), and its home page teaser and nav dock link to the Blog Site.

### Admin Site (`apps/admin`)
The dashboard, sign-in, auth API and every write, on port 3002 locally. It has its own env schema (`REVALIDATE_SECRET`, `MAIN_SITE_URL` and `BLOG_SITE_URL` required; no `ENCRYPTION_KEY`), connects locally as `portfolio_admin`, trusts only its own origin, redirects `/` to `/dashboard` and signed-out visitors to `/sign-in`, and is `noindex` with `robots.txt` disallowing everything. Its local env is `apps/admin/.env.local` (see `apps/admin/.env.example`).

After a write that changes public content, an Admin Site action calls `refreshPublicSites` (`apps/admin/src/lib/refresh-public-sites.ts`) instead of `revalidatePath` for public pages. It posts to each public Site's `/api/revalidate` in parallel with a 3-second timeout and returns a warning instead of failing; the action passes it back as `warning` and the form shows it with `toastRefreshWarning`. `revalidatePath` stays only for the Admin Site's own `/dashboard` pages.

## Local database

Local development runs against a throwaway Postgres in Docker (`packages/db/compose.yaml`), never production.

- Each Site's `src/db/drizzle.ts` uses `createSiteDB`, which throws in development unless `DATABASE_URL` points at `localhost`.
- `pnpm db:reset` wipes and rebuilds it, using the hardcoded URL in `packages/db/src/local.ts`.
- There is no staging environment, so production is the only shared database.

## Schema changes

Three Sites will share one database, so every change must work with the code already running.

- Only `drizzle-kit generate` and `migrate` touch shared databases. `push` and manual SQL are for the throwaway local database.
- **Add:** new columns are nullable or have a default.
- **Rename:** add the new column, backfill, switch the code, drop the old one in a later migration.
- **Drop:** a separate later migration, once every Site has stopped using the column.
- **Enum value:** add it, deploy the readers, then start writing it.
- A new table public pages read also needs a grant in `packages/db/roles.sql` in the same PR.
- Rehearse locally, run it by hand with the owner credential, then merge the PR that uses it. Nothing runs migrations during a build.
- The migration history starts at a baseline verified against the live schema. Commands and the one-time production step are in `packages/db/README.md`.

## Environment Variables

Local values go in `apps/main/.env.local` (see `apps/main/.env.example`). Validated by Zod in `src/utils/env.ts`:

```
DATABASE_URL
NEXT_PUBLIC_MAIN_URL # this Site's address: canonical, sitemap and metadata URLs
NEXT_PUBLIC_BLOG_URL # the Blog Site: blog links and the /blog redirects (read by next.config.ts too)
REVALIDATE_SECRET    # shared with the Admin Site for /api/revalidate; optional so the Site can deploy first, and every refresh call is rejected until it's set
```

## Architecture

Vertical-slice architecture: code is organized by feature/domain first, not by technical layer. Modeled on the sibling `pipfolio-trading-pnl` project's `src/features/<domain>/` pattern.

### Feature slices (`src/features/`)
Twelve domains in the Admin Site: `achievement`, `app-config`, `auth`, `blog`, `education`, `experience`, `media`, `profile`, `project`, `recommendations`, `skills`, `socials`. The Main Site keeps only the public parts (`queries.ts`, section components, and the static `features/achievement/data.tsx`). Each slice has only the subfolders it needs:
```
src/features/<domain>/
  actions/          # Admin Site only: one 'use server' file per domain, imported directly (no barrel)
  queries.ts        # public reads, 'server-only'
  admin-queries.ts  # Admin Site only: dashboard reads for Server Components, 'server-only', scoped to the owner's profile
  components/
  hooks/            # only if the domain needs its own hook (rare today)
  types.ts          # only for types the domain defines itself; shared ones come from `@portfolio/db/schema`
  utils/
```
Tables, zod schemas and domain types are imported straight from `@portfolio/db/schema`; slices don't re-export them.

**Slices don't import each other**, with one sanctioned exception: `features/media` (image picker/upload/CRUD) is a genuine cross-cutting dependency that other slices import directly, the same way pipfolio's `features/profile/components/avatar-upload.tsx` is reused elsewhere. `features/profile` is the aggregate root: `getProfile()` joins every other domain, typed by `IProfile` from `@portfolio/db/schema`.

### Reads and writes
Writes live only in the Admin Site; the Main Site has no `'use server'` file. Keep reads and writes in separate files: every Admin Site dashboard read lives in its slice's `admin-queries.ts` (`server-only`), scoped to the owner through `getOwnProfile()` from `apps/admin/src/lib/auth/session.ts`, never in an `actions/` file. Importing one export from a `'use server'` file can expose every export in it as a callable endpoint, so public pages must never import from `actions/`. Every export in a `'use server'` file must be an `adminAction`.

### Route Groups (`src/app/`)
Pure routing layer — `page.tsx`/`layout.tsx` files are thin wrappers that call a feature's queries or actions and render its components.
- `src/app/(home)/` — public portfolio, single profile page (`revalidate = 60`)
- Admin Site: `apps/admin/src/app/dashboard/` is the CMS and `/api/auth/[...all]` is Better Auth. Its `src/proxy.ts` only checks that a session cookie exists, so every dashboard read and write must check the session itself. On the Main Site, `/dashboard/*` and `/sign-in` are 404s.
- `src/app/api/revalidate` — refreshes public pages when the Admin Site sends `{ resource, slugs }` (type in `@portfolio/db/schema`) with the shared bearer secret
- Route-local composition glue that spans 2+ features (e.g. `app/projects/[projectId]/project-detail.tsx`) stays colocated in the route folder rather than forced into a single feature.

### Database Layer (`packages/db`, `@portfolio/db`)
Stays fully centralized — not split per feature, same as pipfolio's `src/lib/db/`.
- `@portfolio/db/schema` — Drizzle tables (`TbProfile`, `TbProject`, etc.), drizzle-zod schemas, shared domain types (`IProfile`, `IProject`, ...), `genId`, and the refresh message type (`RevalidateMessage`). Opens no connection.
- `@portfolio/db/client` — `createSiteDB({ url, max, site })`, which every Site's `src/db/drizzle.ts` calls and which refuses a non-`localhost` `DATABASE_URL` in development; `createDBClient`/`createDB` for scripts; the `DB` type. Server-only.
- `@portfolio/db/revalidate-route` — `createRevalidateRoute({ secret, pagesFor })`: the shared token check and handler behind each public Site's `/api/revalidate`, which only supplies its `pagesFor` map.
- `@portfolio/db/queries` — reads both public Sites need (`getAppConfig`, `getPublishedBlogPosts`, `getBlogPostBySlug`, `getBlogDetail`). Each takes a `DB` argument; the Site wraps it in one line that passes its own client and applies `cache()`.
- The package also holds `migrations/`, the drizzle-kit configs, the Compose file and the local fixtures.

### Admin actions (`apps/admin/src/lib/admin-action.ts`)
Every Admin Site write is `adminAction(fallbackError, async ({ profile }, ...args) => ...)`. It requires a session (an expired one redirects to `/sign-in`) and the admin's profile, runs the body, then revalidates `dashboardPath` and refreshes the public Sites with `refresh`, both returned by the body along with `data` and `message`. It returns `ActionResult<T>`: `{ success: true, data, message, warning? }` or `{ success: false, error }`. Throw `ActionError` for a message the admin should see; anything else is logged and shown as `fallbackError`. Validate with `parseInput(schema, input, message)` and write the value it returns, never the raw input. Forms show `warning` with `toastRefreshWarning(result)`.

Reads go through each slice's `admin-queries.ts`; the image library is read through `GET /api/images` and `/api/image-folders` (Server Actions run one at a time, so reads would queue behind uploads) via `features/media/hooks/use-images.ts`.

### UI package (`packages/ui`, `@portfolio/ui`)
UI used by public pages: the primitives they need (`@portfolio/ui/button`, `/card`, ...), the pages every Site shares (`/error-page`, `/not-found-page`, `/maintenance-banner`; each Site's `error.tsx`/`not-found.tsx` re-exports them), `RichText` with its Tiptap node stylesheets, `cn`, `icons`, `date-utils`, `convert-date`, the `next/font` definitions (`/fonts`), and the base stylesheet (`/base.css`, imported first by `src/app/globals.css`, with `@source` so Tailwind scans the package). It must not depend on Better Auth, Cloudinary or the Tiptap editor.

### Wireframe package (`packages/wireframe`, `@portfolio/wireframe`)
The alternate site theme for the Main and Blog Sites: its components (`@portfolio/wireframe/<component>`), the sketch helpers every wireframe page uses (`/wireframe-sketch`: `paintEdges`, `observeReveals`, `useSketchPage`, `<Wobble />`), its stylesheet (`/styles.css`, imported by `src/app/globals.css`), and the OG image renderer (`/og`). The OG fonts live beside the renderer and are read with literal `new URL(..., import.meta.url)` paths, so the build traces exactly those files. Data types come from `@portfolio/db/schema`, never from a feature slice.

### Shared components (`src/components/`)
Everything here is cross-cutting infra used by 2+ features — not feature-owned:
- `dock.tsx` / `nav-dock-client.tsx` — public-site nav dock (achievement + home pages)
- flat files (`navbar.tsx`, `resume-card.tsx`) — generic reusable primitives

The Admin Site's `src/components/` also holds the dashboard-only shadcn/ui primitives (`ui/`), the vendored Tiptap editor toolkit (`tiptap-*/`), `dashboard-shell/`, `form-sheet.tsx` and `delete-confirm-button.tsx`.

### Auth
Better Auth with email/password only. Admin Site only. Single admin user seeded via `apps/admin/scripts/seed-admin.ts` (`pnpm db:reset` runs it). Auth config at `apps/admin/src/lib/auth/better-auth.ts`.

### Data Flow (Public Portfolio)
`src/features/profile/queries.ts` → `getProfile()` fetches the entire profile with all related records in one query → passes to each feature's section component as props.

### Image Handling
Admin Site only. Cloudinary for image storage, via `apps/admin/src/features/media/` (actions, image-selector/image-upload/folder-selector components, its own dashboard CMS route). `uploadStagedFile` (a Server Action) calls Cloudinary directly — no intermediate API route. Files are validated client-side against `MAX_FILE_SIZE` (`apps/admin/src/features/media/constants.ts`, 5MB) before upload; `apps/admin/next.config.ts`'s `experimental.serverActions.bodySizeLimit` (8MB) must stay comfortably above that, since Next's Server Action default body limit is 1MB and would otherwise silently reject most real photos.

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `apps/main/node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
