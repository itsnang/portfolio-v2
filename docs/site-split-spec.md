# Site split migration spec

Destination of map [#134](https://github.com/itsnang/portfolio-v2/issues/134), written for [#144](https://github.com/itsnang/portfolio-v2/issues/144). It assembles the decisions from #135 to #143 and #147 to #153. Nothing new is decided here. Gaps found while writing it were raised and settled as #150 to #153.

## Goal

Split this repo into three independently deployed Sites. The reasons, in priority order:

1. Independent deploys, so an Admin Site change can't break the public Sites.
2. Security, keeping admin code and write access away from public Sites.
3. Learning micro frontend architecture, as a bonus.

Out of scope: the Railway database move (deferred, tracked in #154), visual redesign, automated tests or CI, and tightening the image config. The split runs on the current database.

## Target architecture

| Site | Domain | Owns |
| --- | --- | --- |
| Main Site | `lornsamnang.com` | Home, projects, achievement |
| Blog Site | `blog.lornsamnang.com` | Post list and Posts |
| Admin Site | `admin.lornsamnang.com` | Dashboard, sign-in, auth API, all writes |

One repo with pnpm 10 workspaces, no Turborepo or Nx, and three Vercel projects. Blog is a subdomain, so Multi-Zones isn't used.

```text
apps/main, apps/blog  -> @portfolio/wireframe -> @portfolio/ui
                                              -> @portfolio/db (/schema only)
apps/main, apps/blog  -> @portfolio/ui, @portfolio/db
apps/admin            -> @portfolio/ui, @portfolio/db
```

### Vercel (#135)

- One project per Site, with Root Directory set to `apps/main`, `apps/blog`, or `apps/admin`. The existing project becomes the Main Site.
- Keep "Include files outside the root directory" on.
- Use Vercel's skip for unaffected projects. It must be turned on by hand for the reused project.
- Turn on Prioritize Production Builds, because Hobby builds one at a time.
- Delete `package-lock.json` when moving to pnpm.
- Root-level file changes rebuild every Site, so `migrations/` and the Drizzle config move into `packages/db`.

## Shared Packages (#136, #138)

Rules:

- Code moves to a Shared Package only once two Sites use it.
- Packages never import from a Site.
- Inside packages, use relative or package imports. An `@/` import in a package resolves against the consuming Site and can bind to the wrong file. Sites keep `@/` for their own files.
- Packages export TypeScript source, with no `transpilePackages` and no build step.
- Main and Blog don't list `better-auth`, `cloudinary`, or Tiptap, so an accidental import fails the build.
- Vertical slices remain the convention inside each Site.

| Package | Contents |
| --- | --- |
| `@portfolio/db` | Tables, relations, drizzle-zod schemas, domain types, client factory, migrations, drizzle-kit config, roles SQL, Compose file. Entries: `/schema` (no connection), `/client` and `/queries` (`server-only`) |
| `@portfolio/ui` | Primitives used by two or more Sites, `RichText` and its seven `tiptap-node` stylesheets, `cn`, `icons`, `convert-date`, font definitions, base stylesheet (`globals.css` lines 1 to 250) with `@source "./";` |
| `@portfolio/wireframe` | Wireframe components, wireframe stylesheet (`globals.css` line 252 onward), and `lib/og`. Used by Main and Blog only |

Each Site still needs its own `postcss.config.mjs`, and Sites consuming `.scss` need `sass`.

### What stays in each Site

- **Admin Site:** all write Server Actions, `lib/auth`, `features/media`, `dashboard-shell`, the Tiptap editor, `form-sheet`, `delete-confirm-button`, admin-only `ui` primitives, `ReactQueryProvider`, and `scripts/seed-admin.ts`.
- **Main Site:** the nav dock, `resume-card`, `toOgImageUrl`, `lib/metadata`.
- **Blog Site:** its own smaller metadata helper.

## Reads and writes (#136, #138)

- Writes exist only in the Admin Site. No Shared Package contains a write.
- Public reads are plain `server-only` modules with no `'use server'`, because importing one export from a `'use server'` file can expose all of them.

| Read | Owner |
| --- | --- |
| `getAppConfig`, `getPublishedBlogPosts` | `@portfolio/db/queries` |
| `getProfile`, `getProjectDetail`, `getSocials` | Main Site |
| `getBlogDetail`, `getBlogPostBySlug` | Blog Site |
| `getProjects`, `getExperiences`, a small profile query | Admin Site |

- Functions in `@portfolio/db/queries` take a `db` client as an argument. Each Site has a one-line wrapper that passes its own client and applies `cache()`, for example `export const getAppConfig = cache(() => queries.getAppConfig(db))` (#152).
- Every Admin Site read is auth-checked inside the read: plain `server-only` when only Server Components call it, `withAuthAction` when client code does.
- `getExperienceById` and `getProjectById` are deleted.

## Access (#140)

| Variable | Main | Blog | Admin |
| --- | --- | --- | --- |
| `DATABASE_URL` | `portfolio_public` | `portfolio_public` | read/write role |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | no | no | yes |
| `CLOUDINARY_*`, `IMAGE_FOLDER` | no | no | yes |
| `REVALIDATE_SECRET` | yes | yes | yes |
| `MAIN_SITE_URL`, `BLOG_SITE_URL` | no | no | yes |
| `NEXT_PUBLIC_MAIN_URL`, `NEXT_PUBLIC_BLOG_URL` | yes | yes | no |

- Each Site has its own env schema in place of `src/utils/env.ts`. `ENCRYPTION_KEY` is deleted.
- `portfolio_public` has `SELECT` only on `app_config`, `blog_post`, `education`, `experiences`, `profile`, `project`, `recommendations`, `skills`, and `socials`.
- The Admin Site role has `SELECT`, `INSERT`, `UPDATE`, and `DELETE`, with no schema rights.
- The database owner credential is never set on Vercel.
- Roles and grants live in one idempotent SQL file in `packages/db`, run with the owner credential. Passwords stay out of the repo.
- The client factory requires `max`. Each Site starts at `max: 5` with an idle timeout.
- The session cookie stays on `admin.lornsamnang.com`, cross-subdomain cookies stay off, and that host is the only trusted origin.
- The Admin Site has no preview deployments. Main and Blog previews use `portfolio_public` and a preview-only `REVALIDATE_SECRET`.

## Keeping public pages fresh (#139)

```text
Admin Site action
  write to database
  revalidatePath("/dashboard/...")          # Admin Site's own pages
  POST /api/revalidate  { resource, slugs } # Main and Blog, in parallel, 3s timeout
    check bearer token (constant time)
    map resource to this Site's pages
    revalidatePath(each page)
```

| Resource | Main Site | Blog Site |
| --- | --- | --- |
| `post` | `/` | Post list and those Posts |
| `project` | `/`, project pages | none |
| `app-config` | all pages | all pages |
| `socials` | `/`, `/achievement` | none |
| other profile content | `/` | none |

- An edited slug sends both the old and new values.
- A save always stands. A failed or timed-out refresh returns success with a warning, with no retries, and the page timers catch up.
- From step 4 to step 8 of the cutover, the Main Site's `post` mapping also includes `/blog` and its Post pages. Those entries are removed in the PR that removes `/blog` (#150).
- `BLOG_SITE_URL` is optional until step 7. The sender skips a Site whose URL is unset, with no warning, and the variable becomes required at step 7. `MAIN_SITE_URL` is required from the start (#151).
- The message type is shared from `@portfolio/db/schema`. The sender lives in `apps/admin`, and each public Site has its own route handler and mapping.
- Page timers stay. `/achievement` needs one added.

## URLs (#142)

| Old URL on `lornsamnang.com` | After the split |
| --- | --- |
| `/`, `/projects/*`, `/achievement` | Unchanged on the Main Site |
| `/blog` | Redirect to `blog.lornsamnang.com/` |
| `/blog/:path*` | Redirect to `blog.lornsamnang.com/:path*` |
| `/dashboard/*`, `/sign-in` | 404, no redirect |
| `/simple` | Deleted, 404 |

- Posts live at `blog.lornsamnang.com/:slug`.
- Redirects live in the Main Site's `next.config.ts` indefinitely. They start temporary and become permanent at step 9 of the cutover.
- The Admin Site keeps `/dashboard/*` and `/sign-in`, and `/` redirects to `/dashboard`. `proxy.ts` must send visitors without a session to `/sign-in`, because sending them to `/` would loop.

## Navigation (#148)

- The nav dock stays on the Main Site. Both themes of the Blog Site get a simple link home. The Admin Site gets no public links.
- Cross-Site links are plain `<a>` tags in the same tab, built from `NEXT_PUBLIC_MAIN_URL` and `NEXT_PUBLIC_BLOG_URL`. These point at production hosts on previews.
- `@portfolio/wireframe` components take `postUrl`, `allPostsUrl`, and `homeUrl` as props.
- Links to change: the dock's Blog icon, the wireframe "all posts" button, the wireframe Post cards, and `href="/"` in `wireframe-blog-list`.

## SEO (#149)

| Site | Sitemap | `robots.txt` |
| --- | --- | --- |
| Main | Home, achievement, projects | Allow, pointing at its own sitemap |
| Blog | Post list, published Posts | Allow, pointing at its own sitemap |
| Admin | None | `Disallow: /`, and keep `noindex` |

- All canonical, sitemap, and metadata URLs use the `NEXT_PUBLIC_*_URL` env vars.
- Post canonical, Open Graph, and JSON-LD URLs use the Blog Site. `author`, `publisher`, and `Person` JSON-LD URLs stay on the Main Site.
- Each Site has its own `favicon.ico`. The Blog Site gets its own `cover.jpg`.
- Remove the placeholder `your-google-site-verification-code`. Use a DNS-verified Search Console Domain property.
- `lib/og` reads fonts from `process.cwd()` + `src/app/fonts`. The fonts must move with it and load relative to the package.

## PWA (#137)

- Main Site: remove `withPWA` and its dependency. Until it's removed, `next.config.ts` must keep a `turbopack` key, or the build fails. Commit a self-unregistering no-op at `public/sw.js`, remove `/public/sw.js` from `.gitignore`, and keep it for at least 12 months.
- Blog and Admin Sites are not PWAs.

## Schema changes (#141)

- One migration history in `packages/db/migrations`, restarted from a baseline verified against the current database at step 0. #141 tied this to the Railway move, which is now deferred. Old folders and the `NODE_ENV` path split are deleted.
- Only `drizzle-kit generate` and `migrate` touch shared databases.
- Every change is expand, then contract, and must work with the code running on all three Sites:
  - **Add:** nullable or with a default.
  - **Rename:** add, backfill, switch the code, drop later.
  - **Drop:** a separate later migration.
  - **Enum value:** add, deploy readers, then write it.
- Order: rehearse on a throwaway local Postgres, run by hand with the owner credential, then merge.
- Contract migrations go in a later PR, after confirming all three Sites have a successful production deployment of the code that stopped using the column. Take a `pg_dump` first. Migrations only go forward.
- The roles SQL gives the Admin Site role access to new tables by default. Public access needs an explicit grant in the same PR.
- The rules go in a short `CLAUDE.md` section, which must be committed, with commands in a README in `packages/db`.

## Local development (#147)

- Main, Blog, and Admin run on ports 3000, 3001, and 3002. `pnpm dev` starts all three, with a per-Site command too.
- Each Site has its own `.env.local` and a committed `.env.example`. `vercel env pull` isn't used.
- A pinned Postgres image runs through a Compose file in `packages/db`.
- Each Site refuses to start in development unless `DATABASE_URL` points at `localhost`. The local database uses the real roles.
- `pnpm db:reset` applies migrations, roles, committed fixture content (with a draft and a published Post), and the admin account.
- The Admin Site uses a second, free Cloudinary account locally.

## Cutover (#143)

| # | Step | Gate before starting | Done when | Rollback |
| --- | --- | --- | --- | --- |
| 0 | Verified baseline on the current database | | Live schema matches the code | Keep the old migration folders |
| 1 | Prep in the single app, in small PRs | | Each PR works in production | Revert the PR |
| 2 | Monorepo: everything moves to `apps/main` | Local development ready | Home, a project, a Post, and a dashboard save all work | Revert and restore Root Directory |
| 3 | Extract `db`, `ui`, `wireframe`, one PR each | | Same check, and no public Site lists `better-auth`, `cloudinary`, or Tiptap | Revert the PR |
| 4 | Admin Site live, old dashboard still running | `/api/revalidate` live on Main | Sign-in, saving, and image upload work, Main updates after a save, sign-up is refused | Keep using the old dashboard |
| 5 | Remove `/dashboard` from Main | One real edit on the Admin Site | `/dashboard` returns 404 | Revert the PR |
| 6 | Lockdown: Main on `portfolio_public`, admin secrets removed, all secrets rotated | | Main renders on the read-only role, old secrets no longer work | Forward fixes only |
| 7 | Blog Site live with `noindex`, old `/blog` still running | Navigation and SEO work ready | Post list, a Post, OG image, canonical URLs, and refresh after a save all work | Keep using old `/blog` |
| 8 | Remove `/blog` from Main, add temporary redirects and no-op `/sw.js`, remove Blog `noindex`, submit its sitemap | One real edit on the Blog Site | Old URLs land on the right pages | Revert the PR |
| 9 | Flip the redirects to permanent | Blog Site has proven itself | Redirects are permanent | Hard to undo for browsers that cached them |

**Step 1 covers:** separating public reads from writes, splitting `toOgImageUrl` out of `lib/cloudinary`, passing socials and `achievements` as props, moving `ReactQueryProvider` from the root layout to the dashboard layout once public pages stop using it (#153), deleting `/simple`, and capping the `max: 500` connection pool.

**Step 2** lands on production in one sitting: merge to `develop`, change the Root Directory, merge `develop` to `main`, with no other work merging until it's verified.

**Point of no return:** after step 6, the old dashboard can't simply be restored, because its secrets have been rotated.

## Not verified

- pnpm's isolated layout with this repo's real code. The first build at step 2 must confirm it, and that dependency enforcement works.
- Whether the live database matches the code, including whether `blog_post.category` exists.
- The current database's connection limit under three Sites, so `max: 5` is a starting value. If the Railway move in #154 happens later, recheck this there.
- That `main` is the Vercel production branch, inferred from merge history.
- Which database current preview deployments use. This should be checked now.
- Which Vercel plan this account is on, what instant rollback allows on it, and whether per-branch deployment can be disabled.
- `next dev` across packages, refresh behaviour, and the 3-second timeout. Nothing was built or deployed.
- The count of admin-only `ui` files, which came from a search.
- That a service worker was ever live in production, and the no-op worker in Chrome and Safari (#137).
